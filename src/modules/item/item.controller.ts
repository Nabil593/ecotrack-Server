import { Request, Response } from 'express';
import { Item } from '../../models/Item';
import { Payment } from '../../models/payment.model';

// All Items
export const getItems = async (req: Request, res: Response) => {
  try {
    const { search, category, impactTier, sort, page = '1', limit = '8' } = req.query;
    let query: any = {};

    // স্ট্যাটাস ফিল্টার নিশ্চিত করা (শুধু approved আইটেমগুলো দেখাবে)
    query.status = 'approved';

    // ১. সার্চ কুয়েরি (টাইটেল বা ডেসক্রিপশনে ম্যাচ করবে, কেস-ইনসেন্সিটিভ)
    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // ২. ক্যাটাগরি ফিল্টার (একাধিক ক্যাটাগরি কমা দিয়ে হ্যান্ডেল করার সুবিধা সহ)
    if (category && typeof category === 'string' && category.trim() !== '') {
      const categories = category.split(',').map(cat => cat.trim());
      query.category = { $in: categories };
    }

    // ৩. ইমপ্যাক্ট টিয়ার ফিল্টার
    if (impactTier && typeof impactTier === 'string') {
      if (impactTier === 'High') {
        query.impactScore = { $gte: 80 };
      } else if (impactTier === 'Medium') {
        query.impactScore = { $gte: 40, $lt: 80 };
      } else if (impactTier === 'Low') {
        query.impactScore = { $lt: 40 };
      }
    }

    // ৪. সোর্টিং অপশন
    let sortOption: any = { createdAt: -1 };
    if (sort === 'cost-asc') {
      sortOption = { cost: 1 };
    } else if (sort === 'cost-desc') {
      sortOption = { cost: -1 };
    } else if (sort === 'impact') {
      sortOption = { impactScore: -1 };
    }

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit as string, 10) || 8, 1);
    const skip = (pageNum - 1) * limitNum;

    // ডাটা ফেচ এবং টোটাল কাউন্ট
    const items = await Item.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      data: items,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      totalItems: total
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Item Details
export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const singleItem = await Item.findOne({ _id: id });
    
    if (!singleItem) {
      return res.status(404).json({ success: false, message: 'Initiative or emission record not found.' });
    }

    
    const payments = await Payment.find({ itemId: id });
    const totalFunded = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const itemWithFunding = {
      ...singleItem.toObject(),
      totalFunded,
    };

    const baseScore = singleItem.impactScore;

    const seed = (id as string).charCodeAt((id as string).length - 1) || 5;
    const variance = (seed % 5) * 0.12 + 0.75;

    const chartData = [
      { month: 'Month 1', reduction: Math.round(baseScore * 0.8 * variance) },
      { month: 'Month 2', reduction: Math.round(baseScore * 1.5 * variance) },
      { month: 'Month 3', reduction: Math.round(baseScore * 2.4 * variance) },
      { month: 'Month 4', reduction: Math.round(baseScore * 3.6 * variance) },
      { month: 'Month 5', reduction: Math.round(baseScore * 5.1 * variance) },
      { month: 'Current', reduction: Math.round(baseScore * 7.2 * variance) },
    ];

    const relatedItems = await Item.find({ 
      category: singleItem.category, 
      _id: { $ne: singleItem._id } 
    }).limit(4);

    res.status(200).json({
      success: true,
      data: itemWithFunding,
      chartData,
      relatedItems
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// User Items
export const getItemsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await Item.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// User States
// User States
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.email as string;
    if (!userEmail) {
      return res.status(400).json({ success: false, message: "User email is required" });
    }

    const query = {
      $or: [
        { email: userEmail },
        { userEmail: userEmail }
      ]
    };

    const userItems = await Item.find(query);
    const payments = await Payment.find(query);

    const totalImpactScore = userItems.reduce((acc, curr) => acc + (curr.impactScore || 0), 0);
    
    const activeProjects = userItems.filter(item => 
      item.status?.toLowerCase() === "approved"
    ).length;

    const totalMetricsLogged = userItems.length;
    
    // সরাসরি ডলারে সেভ হওয়া পেমেন্ট অ্যামাউন্টগুলো সঠিকভাবে যোগ করার জন্য
    const totalFundingReceived = payments.reduce((acc, curr) => {
      const amt = Number(curr.amount) || 0;
      return acc + amt;
    }, 0);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap: { [key: string]: { emissions: number; offset: number } } = {};

    // বছরের জানুয়ারি থেকে বর্তমান মাস পর্যন্ত সবগুলো মাস জিরো দিয়ে ইনিশিয়ালাইজ করা
    const currentMonthIndex = new Date().getMonth();
    const activeMonths = monthNames.slice(0, currentMonthIndex + 1);

    activeMonths.forEach(m => {
      monthlyMap[m] = { emissions: 0, offset: 0 };
    });

    userItems.forEach(item => {
      const date = item.createdAt ? new Date(item.createdAt) : new Date();
      const monthName = monthNames[date.getMonth()];
      if (monthlyMap[monthName]) {
        monthlyMap[monthName].emissions += Number(item.impactScore) || 0;
      }
    });

    payments.forEach(pay => {
      const date = pay.createdAt ? new Date(pay.createdAt) : new Date();
      const monthName = monthNames[date.getMonth()];
      if (monthlyMap[monthName]) {
        monthlyMap[monthName].offset += Number(pay.amount) || 0;
      }
    });

    const chartData = activeMonths.map(month => ({
      month,
      emissions: monthlyMap[month].emissions,
      offset: monthlyMap[month].offset,
    }));

    return res.status(200).json({
      success: true,
      data: {
        carbonFootprint: totalImpactScore,
        aiRecommendations: userItems.length,
        currentPlan: "Pro",
        activeProjects,
        totalMetricsLogged,
        totalFundingReceived,
        chartData,
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// নতুন আইটেম তৈরি
export const createItem = async (req: Request, res: Response) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// নির্দিষ্ট ইউজারের ইমেইল দিয়ে আইটেমগুলো ম্যানেজ করার জন্য ফেচ করা
export const getItemsByUserEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const items = await Item.find({ userEmail: email });
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// আইটেম আপডেট করার কন্ট্রোলার
export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findOneAndUpdate({ _id: id }, req.body, { new: true });
    
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// আইটেম ডিলিট করার কন্ট্রোলার
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findOneAndDelete({ _id: id });
    
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};