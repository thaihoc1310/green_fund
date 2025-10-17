import loanPackageImg from '../assets/Ảnh dự án nông nghiệp xanh.jpg';

export const loansData = [
  // GREEN AGRICULTURE
  {
    id: 1,
    package: 'green-agriculture',
    projectName: 'Trang trại rau hữu cơ công nghệ cao "Xanh Tự Nhiên"',
    amount: 3500000000,
    purpose: 'Mở rộng quy mô sản xuất lên 5ha với nhà màng, hệ thống tưới nhỏ giọt, nhà sơ chế và kho lạnh đạt chuẩn xuất khẩu',
    creditRating: 'A',
    interestRate: 10.2,
    esgDetails: {
      environmental: 80,
      social: 72,
      governance: 73
    },
    term: 36,
    funded: 45,
    representative: {
      name: 'Nguyễn Văn An',
      position: 'Giám đốc',
      age: 45
    },
    company: {
      name: 'Trang trại Xanh Tự Nhiên',
      type: 'Công ty TNHH',
      registrationLocation: 'Củ Chi, TP.HCM',
      establishedYear: 2018,
      employees: 35,
      revenue: 12000000000
    },
    image: loanPackageImg,
    benefits: ['Tiết kiệm 40% nước', 'Giảm 12 tấn CO₂/năm', 'Tạo 25 việc làm'],
    paymentMethod: 'Trả gốc đều theo quý, lãi hàng tháng',
    description: 'Dự án mở rộng trang trại rau hữu cơ với công nghệ cao, áp dụng hệ thống tưới nhỏ giọt Israel và nhà màng hiện đại để nâng cao năng suất và chất lượng.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 100,
      totalBorrowed: 2000000000,
      totalRepaid: 1500000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Chuẩn bị', duration: '2 tháng', status: 'completed' },
      { phase: 'Thi công', duration: '4 tháng', status: 'in-progress' },
      { phase: 'Vận hành', duration: '30 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Chứng nhận VietGAP', verified: true },
      { name: 'Giấy chứng nhận ESG', verified: true }
    ]
  },
  {
    id: 2,
    package: 'green-agriculture',
    projectName: 'AgriDrone Việt - Ứng dụng drone giám sát cây trồng',
    amount: 5000000000,
    purpose: 'Mở rộng dây chuyền sản xuất và đầu tư 20 drone phục vụ 1.000ha canh tác, giúp giảm 50% thuốc trừ sâu',
    creditRating: 'A',
    interestRate: 11.0,
    esgDetails: {
      environmental: 75,
      social: 68,
      governance: 70
    },
    term: 48,
    funded: 30,
    representative: {
      name: 'Trần Văn Bình',
      position: 'CEO',
      age: 38
    },
    company: {
      name: 'AgriDrone Việt',
      type: 'Công ty Cổ phần',
      registrationLocation: 'Cần Thơ',
      establishedYear: 2020,
      employees: 25,
      revenue: 8000000000
    },
    image: loanPackageImg,
    benefits: ['Giảm 50% thuốc trừ sâu', 'Giảm 18 tấn CO₂/năm', 'Tạo 15 việc làm kỹ thuật'],
    paymentMethod: 'Gốc trả nửa năm/lần, lãi hàng tháng',
    description: 'Startup công nghệ nông nghiệp phát triển hệ thống drone và AI giám sát cây trồng, giúp nông dân tiết kiệm thuốc trừ sâu và tăng năng suất.',
    creditHistory: {
      totalLoans: 1,
      onTimePaymentRate: 100,
      totalBorrowed: 1500000000,
      totalRepaid: 500000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'R&D', duration: '3 tháng', status: 'completed' },
      { phase: 'Sản xuất', duration: '6 tháng', status: 'in-progress' },
      { phase: 'Triển khai', duration: '39 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Chứng nhận công nghệ', verified: true },
      { name: 'Hợp đồng hợp tác ĐH Cần Thơ', verified: true }
    ]
  },
  {
    id: 3,
    package: 'green-agriculture',
    projectName: 'BioFert Mekong - Nhà máy phân bón hữu cơ vi sinh',
    amount: 7000000000,
    purpose: 'Xây dựng nhà máy sản xuất 15.000 tấn phân hữu cơ/năm từ phế phẩm nông nghiệp, giảm phụ thuộc hóa chất',
    creditRating: 'A-',
    interestRate: 10.8,
    esgDetails: {
      environmental: 78,
      social: 65,
      governance: 67
    },
    term: 60,
    funded: 25,
    representative: {
      name: 'Lê Thị Cúc',
      position: 'Giám đốc',
      age: 42
    },
    company: {
      name: 'BioFert Mekong',
      type: 'Công ty TNHH',
      registrationLocation: 'Vĩnh Long',
      establishedYear: 2019,
      employees: 60,
      revenue: 15000000000
    },
    image: loanPackageImg,
    benefits: ['Giảm 12.000 tấn CO₂/năm', 'Cải thiện năng suất 12%', 'Tạo 50 việc làm'],
    paymentMethod: 'Gốc trả theo quý, lãi tháng, 6 tháng ân hạn',
    description: 'Nhà máy sản xuất phân bón hữu cơ vi sinh từ phế phẩm nông nghiệp, góp phần giảm ô nhiễm và cải thiện chất lượng đất trồng.',
    creditHistory: {
      totalLoans: 3,
      onTimePaymentRate: 97,
      totalBorrowed: 4000000000,
      totalRepaid: 3200000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Xây dựng', duration: '6 tháng', status: 'completed' },
      { phase: 'Lắp đặt thiết bị', duration: '4 tháng', status: 'in-progress' },
      { phase: 'Vận hành', duration: '50 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Giấy phép môi trường', verified: true },
      { name: 'Chứng nhận Organic Input EU', verified: true }
    ]
  },
  {
    id: 4,
    package: 'green-agriculture',
    projectName: 'AgriLoop - Chuỗi nông sản tuần hoàn không rác thải',
    amount: 4200000000,
    purpose: 'Xây dựng hệ thống xử lý sinh học và chế biến rau sấy, biến 100% phần bỏ đi thành sản phẩm có giá trị',
    creditRating: 'A',
    interestRate: 9.8,
    esgDetails: {
      environmental: 85,
      social: 74,
      governance: 75
    },
    term: 42,
    funded: 40,
    representative: {
      name: 'Phạm Minh Đức',
      position: 'Giám đốc điều hành',
      age: 40
    },
    company: {
      name: 'AgriLoop',
      type: 'Doanh nghiệp xã hội',
      registrationLocation: 'Lâm Đồng',
      establishedYear: 2021,
      employees: 40,
      revenue: 10000000000
    },
    image: loanPackageImg,
    benefits: ['Giảm 85% rác thải', 'Giảm 10 tấn CO₂/năm', 'Tạo 30 việc làm'],
    paymentMethod: 'Gốc đều theo quý, lãi tháng',
    description: 'Mô hình nông trại tuần hoàn khép kín, tận dụng 100% phế phẩm để tạo ra sản phẩm mới, không tạo ra rác thải.',
    creditHistory: {
      totalLoans: 1,
      onTimePaymentRate: 100,
      totalBorrowed: 2000000000,
      totalRepaid: 800000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Thiết kế hệ thống', duration: '2 tháng', status: 'completed' },
      { phase: 'Xây dựng', duration: '5 tháng', status: 'in-progress' },
      { phase: 'Vận hành', duration: '35 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Chứng nhận B-Corp', verified: true },
      { name: 'Giấy chứng nhận ESG', verified: true }
    ]
  },

  // RENEWABLE ENERGY
  {
    id: 5,
    package: 'renewable-energy',
    projectName: 'SolarVillage - Điện mặt trời áp mái cho khu dân cư nông thôn',
    amount: 6000000000,
    purpose: 'Lắp đặt 400 hệ thống điện mặt trời (3 kWp/hộ) cho 400 hộ nghèo tại Nghệ An, giảm chi phí điện 35%',
    creditRating: 'A',
    interestRate: 9.8,
    esgDetails: {
      environmental: 88,
      social: 82,
      governance: 76
    },
    term: 60,
    funded: 50,
    representative: {
      name: 'Nguyễn Thị Em',
      position: 'Giám đốc dự án',
      age: 36
    },
    company: {
      name: 'SolarVillage',
      type: 'Doanh nghiệp xã hội',
      registrationLocation: 'Hà Nội',
      establishedYear: 2020,
      employees: 45,
      revenue: 18000000000
    },
    image: loanPackageImg,
    benefits: ['Tiết kiệm 1.100 tấn CO₂/năm', 'Giảm 35% chi phí điện', 'Thu nhập từ bán điện'],
    paymentMethod: 'Lãi hàng tháng, gốc niên kim, 6 tháng ân hạn',
    description: 'Dự án năng lượng mặt trời cộng đồng, cung cấp điện sạch cho hộ nghèo nông thôn với chi phí thấp hơn lưới điện quốc gia.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 100,
      totalBorrowed: 3500000000,
      totalRepaid: 2000000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Khảo sát', duration: '2 tháng', status: 'completed' },
      { phase: 'Lắp đặt', duration: '6 tháng', status: 'in-progress' },
      { phase: 'Vận hành & bảo trì', duration: '52 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Hợp đồng mua bán điện EVN', verified: true },
      { name: 'Cam kết UBND huyện', verified: true }
    ]
  },
  {
    id: 6,
    package: 'renewable-energy',
    projectName: 'Wind4Future - Turbine gió mini cho trường học vùng cao',
    amount: 3800000000,
    purpose: 'Lắp đặt 20 turbine gió mini (5 kW) cho 10 trường học và 3 trạm y tế tại Lào Cai & Hà Giang',
    creditRating: 'A',
    interestRate: 10.2,
    esgDetails: {
      environmental: 85,
      social: 78,
      governance: 77
    },
    term: 48,
    funded: 35,
    representative: {
      name: 'Hoàng Văn Phong',
      position: 'CEO',
      age: 43
    },
    company: {
      name: 'Wind4Future',
      type: 'Công ty TNHH',
      registrationLocation: 'Hà Nội',
      establishedYear: 2019,
      employees: 30,
      revenue: 9000000000
    },
    image: loanPackageImg,
    benefits: ['Loại bỏ máy phát diesel', 'Giảm 300 tấn CO₂/năm', 'Đào tạo 30 kỹ thuật viên'],
    paymentMethod: 'Lãi hàng tháng, gốc 6 tháng/lần, 3 tháng ân hạn',
    description: 'Giải pháp năng lượng gió nhỏ cho vùng núi, đảm bảo điện cho trường học và y tế, giảm phụ thuộc máy phát diesel gây ô nhiễm.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 98,
      totalBorrowed: 2500000000,
      totalRepaid: 1800000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Nghiên cứu', duration: '3 tháng', status: 'completed' },
      { phase: 'Lắp đặt', duration: '5 tháng', status: 'in-progress' },
      { phase: 'Vận hành', duration: '40 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Chứng nhận công nghệ', verified: true },
      { name: 'Cam kết địa phương', verified: true }
    ]
  },
  {
    id: 7,
    package: 'renewable-energy',
    projectName: 'SolarCold - Kho lạnh năng lượng mặt trời cho nông sản',
    amount: 4500000000,
    purpose: 'Xây dựng kho lạnh 200 tấn sử dụng pin mặt trời tại Vĩnh Long, giảm thất thoát sau thu hoạch',
    creditRating: 'A',
    interestRate: 9.6,
    esgDetails: {
      environmental: 82,
      social: 75,
      governance: 77
    },
    term: 48,
    funded: 55,
    representative: {
      name: 'Trần Văn Giang',
      position: 'Giám đốc',
      age: 48
    },
    company: {
      name: 'SolarCold',
      type: 'Công ty TNHH',
      registrationLocation: 'Vĩnh Long',
      establishedYear: 2020,
      employees: 28,
      revenue: 11000000000
    },
    image: loanPackageImg,
    benefits: ['Giảm thất thoát từ 25% xuống 8%', 'Tiết kiệm 1,2 tỷ/năm', 'Hợp tác 150 hộ nông dân'],
    paymentMethod: 'Lãi hàng tháng, gốc hàng năm',
    description: 'Kho lạnh năng lượng mặt trời giúp bảo quản nông sản tươi, giảm thất thoát sau thu hoạch, nâng cao thu nhập nông dân.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 99,
      totalBorrowed: 2800000000,
      totalRepaid: 2100000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Xây dựng', duration: '4 tháng', status: 'completed' },
      { phase: 'Lắp đặt thiết bị', duration: '3 tháng', status: 'in-progress' },
      { phase: 'Vận hành', duration: '41 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Hợp đồng thu mua nông sản', verified: true },
      { name: 'Giấy phép xây dựng', verified: true }
    ]
  },
  {
    id: 8,
    package: 'renewable-energy',
    projectName: 'GreenCharge - Mạng lưới trạm sạc EV năng lượng tái tạo',
    amount: 6000000000,
    purpose: 'Xây dựng 5 trạm sạc tốc độ vừa tại Đà Nẵng, tích hợp năng lượng tái tạo và hệ thống quản lý năng lượng',
    creditRating: 'A-',
    interestRate: 11.5,
    esgDetails: {
      environmental: 80,
      social: 70,
      governance: 75
    },
    term: 60,
    funded: 20,
    representative: {
      name: 'Lê Minh Hải',
      position: 'CEO',
      age: 35
    },
    company: {
      name: 'GreenCharge',
      type: 'Công ty Cổ phần',
      registrationLocation: 'Đà Nẵng',
      establishedYear: 2022,
      employees: 22,
      revenue: 5000000000
    },
    image: loanPackageImg,
    benefits: ['Giảm 600 tấn CO₂/năm', 'Thúc đẩy chuyển dịch EV', 'Kết hợp F&B'],
    paymentMethod: 'Niên kim (gốc + lãi đều hàng tháng)',
    description: 'Hệ thống trạm sạc xe điện xanh, sử dụng năng lượng tái tạo, góp phần thúc đẩy giao thông bền vững.',
    creditHistory: {
      totalLoans: 1,
      onTimePaymentRate: 100,
      totalBorrowed: 1500000000,
      totalRepaid: 300000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Khảo sát địa điểm', duration: '2 tháng', status: 'completed' },
      { phase: 'Xây dựng trạm', duration: '6 tháng', status: 'in-progress' },
      { phase: 'Vận hành', duration: '52 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Hợp đồng thuê mặt bằng', verified: true },
      { name: 'Giấy phép điện lực', verified: true }
    ]
  },

  // SUSTAINABLE CONSUMPTION
  {
    id: 9,
    package: 'sustainable-consumption',
    projectName: 'BioWrap - Dây chuyền sản xuất bao bì sinh học từ bã mía',
    amount: 7000000000,
    purpose: 'Đầu tư dây chuyền sản xuất bao bì phân hủy sinh học (1.200 tấn/năm) thay thế túi nilon',
    creditRating: 'A',
    interestRate: 10.0,
    esgDetails: {
      environmental: 84,
      social: 72,
      governance: 72
    },
    term: 60,
    funded: 38,
    representative: {
      name: 'Nguyễn Thị Hoa',
      position: 'Giám đốc',
      age: 41
    },
    company: {
      name: 'BioWrap',
      type: 'Công ty TNHH',
      registrationLocation: 'Bình Dương',
      establishedYear: 2021,
      employees: 48,
      revenue: 14000000000
    },
    image: loanPackageImg,
    benefits: ['Thay thế 50 triệu túi nilon/năm', 'Giảm 400 tấn CO₂/năm', 'Hợp tác 20 nhà máy mía'],
    paymentMethod: 'Gốc hàng năm, lãi hàng tháng',
    description: 'Sản xuất bao bì sinh học từ bã mía, thay thế nhựa nilon, giảm ô nhiễm môi trường và tận dụng phế phẩm nông nghiệp.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 98,
      totalBorrowed: 3000000000,
      totalRepaid: 2200000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Nghiên cứu sản phẩm', duration: '4 tháng', status: 'completed' },
      { phase: 'Lắp đặt dây chuyền', duration: '6 tháng', status: 'in-progress' },
      { phase: 'Sản xuất & mở rộng', duration: '50 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Chứng nhận Compostable', verified: true },
      { name: 'Hợp đồng cung cấp nguyên liệu', verified: true }
    ]
  },
  {
    id: 10,
    package: 'sustainable-consumption',
    projectName: 'GreenCos - Mỹ phẩm thiên nhiên từ dược liệu bản địa',
    amount: 3500000000,
    purpose: 'Mở rộng nhà xưởng chiết xuất tinh dầu, đầu tư hệ thống chiết suất lạnh đạt chuẩn GMP',
    creditRating: 'A',
    interestRate: 10.5,
    esgDetails: {
      environmental: 75,
      social: 70,
      governance: 71
    },
    term: 36,
    funded: 60,
    representative: {
      name: 'Trần Thị Hương',
      position: 'CEO',
      age: 39
    },
    company: {
      name: 'GreenCos',
      type: 'Công ty TNHH',
      registrationLocation: 'Quảng Nam',
      establishedYear: 2019,
      employees: 32,
      revenue: 8500000000
    },
    image: loanPackageImg,
    benefits: ['Nâng giá trị dược liệu', 'Thu nhập 200 hộ trồng', 'Giảm 20% nhựa bao bì'],
    paymentMethod: 'Trả đều gốc & lãi hàng tháng',
    description: 'Sản xuất mỹ phẩm thiên nhiên từ dược liệu địa phương, bảo tồn tri thức bản địa và tạo thu nhập cho nông dân.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 100,
      totalBorrowed: 2200000000,
      totalRepaid: 1800000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Xây dựng nhà xưởng', duration: '3 tháng', status: 'completed' },
      { phase: 'Lắp đặt & GMP', duration: '4 tháng', status: 'in-progress' },
      { phase: 'Sản xuất', duration: '29 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Chứng nhận GMP', verified: true },
      { name: 'Hợp đồng thu mua dược liệu', verified: true }
    ]
  },
  {
    id: 11,
    package: 'sustainable-consumption',
    projectName: 'EcoClean - Nước giặt enzym sinh học & chai tái chế',
    amount: 2800000000,
    purpose: 'Nghiên cứu enzyme, mở phòng thí nghiệm và đầu tư dây chuyền đóng chai PET tái chế',
    creditRating: 'A-',
    interestRate: 10.5,
    esgDetails: {
      environmental: 78,
      social: 72,
      governance: 72
    },
    term: 36,
    funded: 42,
    representative: {
      name: 'Lê Văn Kiên',
      position: 'Giám đốc R&D',
      age: 37
    },
    company: {
      name: 'EcoClean',
      type: 'Công ty TNHH',
      registrationLocation: 'Bình Dương',
      establishedYear: 2021,
      employees: 20,
      revenue: 6000000000
    },
    image: loanPackageImg,
    benefits: ['Giảm hóa chất độc hại', 'Giảm 40% nhựa mới', 'Thu gom rác tái chế'],
    paymentMethod: 'Lãi hàng tháng, gốc 6 tháng/lần',
    description: 'Phát triển nước giặt sinh học thân thiện môi trường, sử dụng bao bì tái chế, giảm rác thải nhựa.',
    creditHistory: {
      totalLoans: 1,
      onTimePaymentRate: 100,
      totalBorrowed: 1200000000,
      totalRepaid: 600000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Nghiên cứu enzyme', duration: '4 tháng', status: 'completed' },
      { phase: 'Xây dựng dây chuyền', duration: '5 tháng', status: 'in-progress' },
      { phase: 'Sản xuất', duration: '27 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Bằng sáng chế enzyme', verified: true },
      { name: 'Chứng nhận an toàn hóa chất', verified: true }
    ]
  },
  {
    id: 12,
    package: 'sustainable-consumption',
    projectName: 'ReBottle - Dây chuyền tái chế PET & sản xuất hạt tái chế',
    amount: 5000000000,
    purpose: 'Mua máy nghiền, rửa, sấy và ép hạt PET tái chế (200 tấn/năm) phục vụ ngành đóng gói',
    creditRating: 'A-',
    interestRate: 11.0,
    esgDetails: {
      environmental: 80,
      social: 68,
      governance: 71
    },
    term: 60,
    funded: 28,
    representative: {
      name: 'Phạm Văn Long',
      position: 'Giám đốc',
      age: 44
    },
    company: {
      name: 'ReBottle',
      type: 'Công ty TNHH',
      registrationLocation: 'Bắc Ninh',
      establishedYear: 2020,
      employees: 50,
      revenue: 12000000000
    },
    image: loanPackageImg,
    benefits: ['Thu hồi 200 tấn nhựa/năm', 'Giảm 500 tấn CO₂/năm', 'Tạo 40 việc làm'],
    paymentMethod: 'Lãi hàng tháng, gốc năm/6 tháng',
    description: 'Nhà máy tái chế nhựa PET, chuyển hóa rác thải nhựa thành hạt tái chế chất lượng cao cho ngành sản xuất.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 97,
      totalBorrowed: 2800000000,
      totalRepaid: 2000000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Mua thiết bị', duration: '3 tháng', status: 'completed' },
      { phase: 'Lắp đặt dây chuyền', duration: '4 tháng', status: 'in-progress' },
      { phase: 'Sản xuất', duration: '53 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Giấy phép môi trường', verified: true },
      { name: 'Hợp đồng mua bán rPET', verified: true }
    ]
  },

  // ENVIRONMENTAL TECH
  {
    id: 13,
    package: 'environmental-tech',
    projectName: 'AquaTech - Hệ thống xử lý nước thải KCN tích hợp AI',
    amount: 8000000000,
    purpose: 'Triển khai hệ thống xử lý nước thải tích hợp IoT + AI cho khu công nghiệp Long An',
    creditRating: 'A',
    interestRate: 11.8,
    esgDetails: {
      environmental: 92,
      social: 80,
      governance: 83
    },
    term: 60,
    funded: 32,
    representative: {
      name: 'Nguyễn Văn Minh',
      position: 'CTO',
      age: 42
    },
    company: {
      name: 'AquaTech',
      type: 'Công ty Cổ phần',
      registrationLocation: 'TP.HCM',
      establishedYear: 2018,
      employees: 55,
      revenue: 25000000000
    },
    image: loanPackageImg,
    benefits: ['Giảm 35% chi phí xử lý', 'Giảm 2.000 tấn CO₂/năm', 'Đạt QCVN 40:2011'],
    paymentMethod: 'Gốc 1 năm/lần, lãi hàng tháng',
    description: 'Hệ thống xử lý nước thải thông minh sử dụng AI tối ưu hóa quy trình, tiết kiệm hóa chất và năng lượng.',
    creditHistory: {
      totalLoans: 4,
      onTimePaymentRate: 98,
      totalBorrowed: 12000000000,
      totalRepaid: 9000000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Thiết kế hệ thống', duration: '4 tháng', status: 'completed' },
      { phase: 'Lắp đặt & triển khai', duration: '8 tháng', status: 'in-progress' },
      { phase: 'Vận hành', duration: '48 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Hợp đồng dịch vụ KCN', verified: true },
      { name: 'Chứng nhận công nghệ', verified: true }
    ]
  },
  {
    id: 14,
    package: 'environmental-tech',
    projectName: 'SmartWaste - Hệ thống phân loại rác tự động tại nguồn',
    amount: 5500000000,
    purpose: 'Triển khai 1.000 thùng rác thông minh tại TP.HCM với cảm biến AI phân loại rác',
    creditRating: 'A',
    interestRate: 10.5,
    esgDetails: {
      environmental: 86,
      social: 78,
      governance: 76
    },
    term: 48,
    funded: 48,
    representative: {
      name: 'Trần Thị Ngọc',
      position: 'CEO',
      age: 38
    },
    company: {
      name: 'SmartWaste',
      type: 'Công ty Cổ phần',
      registrationLocation: 'TP.HCM',
      establishedYear: 2021,
      employees: 38,
      revenue: 13000000000
    },
    image: loanPackageImg,
    benefits: ['Tăng tỷ lệ tái chế từ 15% lên 45%', 'Giảm 20% chi phí vận chuyển', 'Tích điểm đổi quà'],
    paymentMethod: 'Gốc theo quý, lãi hàng tháng',
    description: 'Thùng rác thông minh tích hợp AI phân loại rác tự động, khuyến khích người dân phân loại rác bằng hệ thống tích điểm.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 100,
      totalBorrowed: 3000000000,
      totalRepaid: 1500000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Phát triển sản phẩm', duration: '4 tháng', status: 'completed' },
      { phase: 'Triển khai pilot', duration: '6 tháng', status: 'in-progress' },
      { phase: 'Mở rộng', duration: '38 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Hợp đồng với UBND quận', verified: true },
      { name: 'Chứng nhận IoT', verified: true }
    ]
  },
  {
    id: 15,
    package: 'environmental-tech',
    projectName: 'ReLife - Nhà máy tái chế pin lithium & thiết bị điện tử',
    amount: 6000000000,
    purpose: 'Xây dựng xưởng tái chế pin lithium (200 tấn/năm) với quy trình tách chiết kim loại quý',
    creditRating: 'A',
    interestRate: 11.5,
    esgDetails: {
      environmental: 88,
      social: 76,
      governance: 82
    },
    term: 60,
    funded: 25,
    representative: {
      name: 'Lê Quốc Nam',
      position: 'Giám đốc kỹ thuật',
      age: 46
    },
    company: {
      name: 'ReLife',
      type: 'Công ty TNHH',
      registrationLocation: 'Bắc Ninh',
      establishedYear: 2020,
      employees: 42,
      revenue: 15000000000
    },
    image: loanPackageImg,
    benefits: ['Thu hồi Li, Co, Ni', 'Giảm 50 tấn chất thải nguy hại/năm', 'An toàn phòng cháy'],
    paymentMethod: 'Lãi hàng quý, gốc cuối kỳ',
    description: 'Nhà máy tái chế pin lithium chuyên nghiệp, thu hồi kim loại quý, xử lý chất thải nguy hại an toàn.',
    creditHistory: {
      totalLoans: 2,
      onTimePaymentRate: 99,
      totalBorrowed: 4000000000,
      totalRepaid: 2500000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Xây dựng nhà xưởng', duration: '6 tháng', status: 'completed' },
      { phase: 'Lắp đặt thiết bị', duration: '6 tháng', status: 'in-progress' },
      { phase: 'Vận hành', duration: '48 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Giấy phép chất thải nguy hại', verified: true },
      { name: 'Chứng nhận an toàn PCCC', verified: true }
    ]
  },
  {
    id: 16,
    package: 'environmental-tech',
    projectName: 'CarbonTrack - Nền tảng đo lường & bán tín chỉ carbon',
    amount: 6000000000,
    purpose: 'Phát triển nền tảng blockchain ghi nhận phát thải và thị trường tín chỉ carbon cho SME',
    creditRating: 'A-',
    interestRate: 12.3,
    esgDetails: {
      environmental: 90,
      social: 85,
      governance: 90
    },
    term: 48,
    funded: 18,
    representative: {
      name: 'Phạm Thị Oanh',
      position: 'CEO',
      age: 34
    },
    company: {
      name: 'CarbonTrack',
      type: 'Công ty Cổ phần',
      registrationLocation: 'Hà Nội',
      establishedYear: 2022,
      employees: 28,
      revenue: 7000000000
    },
    image: loanPackageImg,
    benefits: ['Tuân thủ GHG protocol', 'Minh bạch blockchain', 'Onboarding 200 DN'],
    paymentMethod: 'Lãi hàng tháng, gốc cuối kỳ',
    description: 'Nền tảng công nghệ đo lường carbon footprint và giao dịch tín chỉ carbon trên blockchain, giúp SME tuân thủ quy định ESG.',
    creditHistory: {
      totalLoans: 1,
      onTimePaymentRate: 100,
      totalBorrowed: 2000000000,
      totalRepaid: 500000000,
      defaultCount: 0
    },
    timeline: [
      { phase: 'Phát triển platform', duration: '6 tháng', status: 'completed' },
      { phase: 'Onboarding DN', duration: '8 tháng', status: 'in-progress' },
      { phase: 'Mở rộng thị trường', duration: '34 tháng', status: 'pending' }
    ],
    documents: [
      { name: 'Giấy phép kinh doanh', verified: true },
      { name: 'Báo cáo tài chính 2024', verified: true },
      { name: 'Chứng nhận GHG protocol', verified: true },
      { name: 'Whitepaper blockchain', verified: true }
    ]
  }
];

// Helper function to calculate ESG Score
export const calculateESGScore = (esgDetails) => {
  return Math.round((esgDetails.environmental + esgDetails.social + esgDetails.governance) / 3);
};
