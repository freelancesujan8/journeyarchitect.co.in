/**
 * Journey Architect — Synchronized Database Package Seeds (Frontend Fallback Parity)
 */

export const SEED_PACKAGES_PARSED = [
  {
    id: "PKG-DARJ-01",
    package_id: "PKG-DARJ-01",
    name: "Darjeeling & Kalimpong Himalayan Retreat",
    slug: "darjeeling-kalimpong-himalayan-retreat",
    destination: "Darjeeling, Kalimpong & Kurseong",
    tour_category: "mountains",
    short_description: "Witness the golden Kanchenjunga sunrise from Tiger Hill, explore sprawling emerald tea estates, ride the heritage Toy Train, and experience serene Himalayan monastery life.",
    description: "Discover the breathtaking beauty of North Bengal's hills. This comprehensive package includes comfortable hotel stays in central Darjeeling and Kalimpong, private vehicle sightseeing across Batasia Loop, Peace Pagoda, Ghoom Monastery, Delo Hill, and pine-scented viewpoints.",
    thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    featured_image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85",
    gallery_images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
    ],
    duration_days: 5,
    duration_nights: 4,
    total_price: 24000,
    adult_price: 12000,
    child_price: 7000,
    infant_price: 0,
    payment_type: "fixed",
    booking_amount: 5000,
    booking_percentage: 20,
    availability_status: "available",
    max_seats: 30,
    booked_seats: 12,
    featured: 1,
    status: "published",
    hotel_info: "Hotel Summit Swiss Heritage & Elgin Kalimpong (Deluxe Mountain View Rooms with Room Heaters, WiFi & 24/7 Hot Water)",
    transport_info: "Dedicated Private SUV (Toyota Innova / Xylo) with experienced local hill driver for all transfers, Tiger Hill and sightseeing.",
    meals_info: "Daily Morning Breakfast & Multi-Cuisine Dinner Buffet included (MAP Plan). Welcome Himalayan Tea.",
    important_notes: "Valid Government photo IDs (Aadhaar / Voter ID) required. Warm jackets and woolens recommended for morning Tiger Hill excursion.",
    terms_and_conditions: "50% refund on cancellations requested 15+ days prior to departure. Free date rescheduling up to 7 days before travel.",
    cancellation_policy: "Free date rescheduling up to 7 days before departure. Advance booking amount is refundable as per standard policy.",
    inclusions: [
      "4 Nights accommodation in deluxe mountain view double rooms",
      "Daily breakfast and dinner (MAP Plan)",
      "Private dedicated Innova/Xylo vehicle for all transfers and sightseeing",
      "Tiger Hill sunrise special permit & entrance fee assistance",
      "Sightseeing in Darjeeling: Batasia Loop, Ghoom, HMI, Zoo, Ropeway, Tea Garden",
      "Sightseeing in Kalimpong: Delo Hill, Science City, Cactus Nursery, Mangal Dham",
      "All driver allowances, fuel, toll taxes, parking fees, and state entry permits"
    ],
    exclusions: [
      "Train / Air tickets to/from NJP or Bagdogra Airport",
      "Heritage DHR Toy Train joyride tickets (available on prior request)",
      "Personal expenses, laundry, telephone calls, camera fees",
      "Meals not specified in the inclusions list"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at NJP / Bagdogra & Scenic Transfer to Darjeeling",
        description: "Warm welcome by Journey Architect team representative at NJP railway station or Bagdogra Airport. Scenic 3-hour drive through lush tea gardens and pine forests with a stoppage at Rohini Viewpoint. Check in at hotel, evening stroll at the historic Darjeeling Mall (Chowrasta) & Glenary's Bakery."
      },
      {
        day: 2,
        title: "Tiger Hill Kanchenjunga Sunrise & 7-Points Darjeeling Tour",
        description: "Early 4:00 AM excursion to Tiger Hill (8,400 ft) for a spectacular golden sunrise over Mount Kanchenjunga. Visit Batasia Loop war memorial and historic Ghoom Monastery. After hearty breakfast, visit Himalayan Mountaineering Institute (HMI), P.N. Himalayan Zoological Park, Darjeeling Ropeway, Tenzing Rock, and Tibetan Refugee Self-Help Centre."
      },
      {
        day: 3,
        title: "Happy Valley Tea Estate & Scenic Transfer to Kalimpong",
        description: "Morning guided walk through Happy Valley Tea Estate and visit the Japanese Peace Pagoda. Enjoy a picturesque drive to Kalimpong (2.5 hrs) along the Teesta valley. Check in at hotel and explore local Tibetan craft markets in Kalimpong town."
      },
      {
        day: 4,
        title: "Kalimpong Sightseeing — Delo Hill & Pineview Cactus Nursery",
        description: "Visit Delo Hill (highest point in Kalimpong for 360-degree panoramic views), Kalimpong Science Centre, Pineview Cactus Nursery featuring over 1,500 exotic cacti species, Dr. Graham's Homes, and serene Mangal Dham temple."
      },
      {
        day: 5,
        title: "Teesta River Viewpoint & Departure to NJP / Bagdogra",
        description: "After breakfast, check out from hotel. Scenic downhill drive with a stop at Lover's Meet View Point (confluence of Teesta and Rangeet rivers). Drop-off at NJP Station / Bagdogra Airport with fond memories of the Queen of Hills."
      }
    ]
  },
  {
    id: "PKG-SIKK-02",
    package_id: "PKG-SIKK-02",
    name: "Sikkim Highland Explorer — Gangtok & North Sikkim",
    slug: "sikkim-highland-explorer-gangtok-north-sikkim",
    destination: "Gangtok, Lachen, Gurudongmar & Lachung",
    tour_category: "mountains",
    short_description: "Explore sacred glacial lakes, snow-clad mountain passes, pristine alpine valleys of flowers, and peaceful Buddhist monasteries in Sikkim.",
    description: "An unforgettable highland journey covering the vibrant capital Gangtok, high-altitude Tsomgo Lake, Baba Mandir, and the dramatic snowy landscapes of North Sikkim including Lachen, Gurudongmar Lake (17,800 ft), Lachung, and Yumthang Valley.",
    thumbnail: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    featured_image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&q=85",
    gallery_images: [
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1000&q=80"
    ],
    duration_days: 6,
    duration_nights: 5,
    total_price: 32000,
    adult_price: 16000,
    child_price: 9500,
    infant_price: 0,
    payment_type: "percentage",
    booking_amount: 6400,
    booking_percentage: 20,
    availability_status: "available",
    max_seats: 25,
    booked_seats: 18,
    featured: 1,
    status: "published",
    hotel_info: "Hotel Golden Crest Gangtok + Cozy Mountain Retreats in Lachen & Lachung (Heaters & Warm Bedding)",
    transport_info: "Dedicated 4WD Tourist Vehicle (Scorpio / Bolero / Innova) with experienced mountain driver for all North Sikkim rough terrain.",
    meals_info: "All Meals Included during North Sikkim trip (Breakfast, Lunch & Dinner). Breakfast & Dinner in Gangtok.",
    important_notes: "Sikkim Inner Line Permits required. Please carry 4 passport-size photographs and Original Voter ID / Passport for all travelers.",
    terms_and_conditions: "North Sikkim & Nathula passes are subject to Indian Army & Tourism Dept permit approvals based on weather conditions.",
    cancellation_policy: "Standard cancellation policy applies. Date rescheduling supported with 7-day prior notice.",
    inclusions: [
      "5 Nights accommodation (3N Gangtok, 1N Lachen, 1N Lachung)",
      "All meals in North Sikkim + Breakfast & Dinner in Gangtok",
      "Private 4WD tourist vehicle for the entire tour",
      "Tsomgo Glacial Lake & Baba Mandir excursion with permits",
      "Gurudongmar Lake (17,800 ft) & Yumthang Valley permits",
      "All Sikkim entry taxes, parking fees, and driver allowances"
    ],
    exclusions: [
      "Nathula Pass special permit charges (optional add-on @ ₹5,000/vehicle)",
      "Zero Point / Kala Patthar excursion supplement (payable locally if chosen)",
      "Train / Air tickets to Siliguri or Bagdogra"
    ],
    itinerary: [
      {
        day: 1,
        title: "NJP / Bagdogra to Gangtok — Welcome to the Land of Monasteries",
        description: "Pickup from NJP/Bagdogra and drive along the Teesta river into Sikkim. Check in at hotel in Gangtok. Evening leisure walk on the pedestrian MG Marg with cafes and shopping."
      },
      {
        day: 2,
        title: "Tsomgo Glacial Lake (12,400 ft) & Baba Harbhajan Singh Mandir",
        description: "Morning excursion to the oval-shaped Tsomgo Lake surrounded by snow-capped Himalayan peaks. Enjoy yak rides, visit Baba Harbhajan Singh Mandir, and return to Gangtok by evening."
      },
      {
        day: 3,
        title: "Gangtok to Lachen — Gateway to High Altitude North Sikkim",
        description: "Scenic 6-hour drive passing Singhik Viewpoint, Seven Sisters Waterfall, Naga Waterfall, and Chungthang confluence. Arrive at the peaceful alpine village of Lachen (8,830 ft). Enjoy a warm local dinner."
      },
      {
        day: 4,
        title: "Gurudongmar Sacred Lake (17,800 ft) & Transfer to Lachung",
        description: "Early morning drive through Cold Desert valley to Gurudongmar Lake, one of the highest sacred freshwater lakes in the world. Post lunch in Lachen, transfer to the scenic valley of Lachung (8,610 ft)."
      },
      {
        day: 5,
        title: "Yumthang Valley of Flowers & Return to Gangtok",
        description: "Morning drive to Yumthang Valley (11,800 ft) with hot sulfur springs, rhododendron blooms, and panoramic snow peaks. Post lunch, scenic transfer back to Gangtok for hotel check-in."
      },
      {
        day: 6,
        title: "Gangtok Sightseeing & Departure to NJP / Bagdogra",
        description: "Visit Rumtek Monastery, Do Drul Chorten stupa, and Namgyal Institute of Tibetology. Scenic downhill drive to NJP/Bagdogra with memories of high Himalayan wonderland."
      }
    ]
  },
  {
    id: "PKG-DOOR-03",
    package_id: "PKG-DOOR-03",
    name: "Dooars Wilderness & Tea Trail Safari",
    slug: "dooars-wilderness-tea-trail-safari",
    destination: "Gorumara, Lataguri, Jaldapara & Murti",
    tour_category: "nature",
    short_description: "Immerse in dense green forest canopies, open grassland safaris, one-horned rhinoceros tracking, and tranquil riverside evenings.",
    description: "A refreshing wildlife and nature holiday exploring Gorumara National Park, Jaldapara Rhino Sanctuary, Murti riverbank, and the charming foothill villages of Samsing, Suntalekhola and Rocky Island.",
    thumbnail: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80",
    featured_image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1600&q=85",
    gallery_images: [
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1000&q=80"
    ],
    duration_days: 4,
    duration_nights: 3,
    total_price: 18000,
    adult_price: 9000,
    child_price: 5500,
    infant_price: 0,
    payment_type: "fixed",
    booking_amount: 4000,
    booking_percentage: 22,
    availability_status: "available",
    max_seats: 20,
    booked_seats: 6,
    featured: 1,
    status: "published",
    hotel_info: "Murti River Forest Resort & Lataguri Nature Retreat (AC Deluxe Cottages, Swimming Pool & Garden)",
    transport_info: "Private AC Vehicle (Swift Dzire / Ertiga / Innova) for all transfers, village excursions, and safari access.",
    meals_info: "Full Board Meals: Daily Breakfast, Traditional Bengali Lunch & Dinner at the Forest Resort.",
    important_notes: "Jungle safaris operate based on Forest Dept shifts. Please bring Government photo IDs for safari permits.",
    terms_and_conditions: "Safari permits are issued by the West Bengal Forest Department counters.",
    cancellation_policy: "Flexible cancellation up to 5 days prior to arrival.",
    inclusions: [
      "3 Nights stay in AC Deluxe Cottage at Murti River Forest Resort",
      "All meals: Morning Breakfast, Traditional Lunch & Dinner Buffet",
      "Private AC vehicle for all transfers and local village tours",
      "Samsing, Suntalekhola Hanging Bridge & Rocky Island excursion",
      "Murti River evening bonfire & local tribal folk dance (subject to weather)"
    ],
    exclusions: [
      "Forest Jeep Safari / Elephant Safari entry tickets & guide fees",
      "Train tickets to New Mal Junction or NJP"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at NJP / New Mal Junction & Lataguri Forest Check-in",
        description: "Pickup from station and scenic drive through Dooars tea estates to your Murti / Lataguri forest resort. Relax by the riverbank. Evening Medla watchtower safari in Gorumara with bullock-cart ride."
      },
      {
        day: 2,
        title: "Gorumara National Park Jeep Safari & Rhino Tracking",
        description: "Early morning jungle jeep safari in search of Indian one-horned rhinos, wild elephants, gaur, and deer. Afternoon visit to Jatraprasad Watchtower and local tea estate tasting."
      },
      {
        day: 3,
        title: "Offbeat Day Trip: Samsing, Suntalekhola & Rocky Island",
        description: "Day excursion to the lush green tea hills of Samsing, the suspension footbridge at Suntalekhola, and crystal clear mountain river pools at Rocky Island."
      },
      {
        day: 4,
        title: "Morning River Walk, Birdwatching & Departure",
        description: "Enjoy peaceful birdwatching along the Murti riverbank. Check out and transfer to New Mal Junction / NJP Station for onward journey."
      }
    ]
  },
  {
    id: "PKG-PURI-04",
    package_id: "PKG-PURI-04",
    name: "Puri Coastal Serenity & Konark Sun Temple",
    slug: "puri-coastal-serenity-konark-sun-temple",
    destination: "Puri, Konark & Chilika Lake",
    tour_category: "coastal",
    short_description: "Relax by the golden sands of Puri beach, seek blessings at the sacred Jagannath Temple, and marvel at the architectural wonders of Konark Sun Temple.",
    description: "The ultimate beach and heritage escape combining relaxing golden coastlines, delicious coastal seafood, sacred darshan, Chilika Lake dolphin boating, and the UNESCO World Heritage Konark temple.",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    featured_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    gallery_images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80"
    ],
    duration_days: 4,
    duration_nights: 3,
    total_price: 16000,
    adult_price: 8000,
    child_price: 4800,
    infant_price: 0,
    payment_type: "fixed",
    booking_amount: 3500,
    booking_percentage: 20,
    availability_status: "available",
    max_seats: 30,
    booked_seats: 15,
    featured: 1,
    status: "published",
    hotel_info: "Mayfair Waves / Sterling Puri Sea-Facing Resort (Deluxe Sea View AC Rooms on Marine Drive)",
    transport_info: "Dedicated Private AC Sedan / SUV (Dzire / Ertiga) for all airport/station transfers and sightseeing.",
    meals_info: "Daily Breakfast Buffet & Coastal Seafood Special Dinner included at hotel restaurant.",
    important_notes: "Leather articles, cameras, and mobile phones are strictly prohibited inside Jagannath Temple premises.",
    terms_and_conditions: "Temple darshan timing is subject to temple administration rituals.",
    cancellation_policy: "Free date change up to 4 days prior to travel.",
    inclusions: [
      "3 Nights stay in Deluxe AC sea-facing room on Marine Drive",
      "Daily breakfast and dinner (MAP Plan)",
      "Private AC Sedan/SUV for entire itinerary and transfers",
      "UNESCO Konark Sun Temple & Chandrabhaga Beach excursion",
      "Chilika Lake (Satapada) Irrawaddy Dolphin excursion",
      "Raghurajpur Heritage Craft Village & Pipili applique tour"
    ],
    exclusions: [
      "Train / flight tickets to Bhubaneswar or Puri",
      "OTDC boat ticket charges at Chilika Lake (payable directly at counter)",
      "Temple VIP darshan passes"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Puri & Golden Beach Sunset Walk",
        description: "Pickup from Puri Railway Station or Bhubaneswar Airport. Scenic drive to your sea-facing hotel on Marine Drive. Check in, relax, and spend the evening enjoying golden beach waves and sea breeze."
      },
      {
        day: 2,
        title: "Jagannath Temple Darshan & Konark Sun Temple",
        description: "Morning darshan at Shree Jagannath Temple with local priest assistance. Afternoon drive along Marine Drive to UNESCO World Heritage Konark Sun Temple and Chandrabhaga beach for sunset."
      },
      {
        day: 3,
        title: "Chilika Lake (Satapada) Dolphin Excursion & Sea Mouth",
        description: "Day excursion to Satapada on Asia's largest brackish lagoon Chilika Lake. Enjoy motorboat cruise to spot rare Irrawaddy dolphins and visit Rajhans island."
      },
      {
        day: 4,
        title: "Raghurajpur Heritage Village & Departure",
        description: "Check out after breakfast. Visit the famous Pattachitra artisan village of Raghurajpur and Pipili applique market. Drop-off at Puri / Bhubaneswar station for departure."
      }
    ]
  },
  {
    id: "PKG-SUND-05",
    package_id: "PKG-SUND-05",
    name: "Sundarbans Mangrove & Royal Bengal Cruise",
    slug: "sundarbans-mangrove-royal-bengal-cruise",
    destination: "Sundarbans National Park & Delta",
    tour_category: "nature",
    short_description: "Cruise through the mystical mangrove tidal creeks, explore watchtowers, spot estuarine crocodiles, spotted deer, and track the elusive Royal Bengal Tiger.",
    description: "An exotic 3-day delta safari navigating the UNESCO World Heritage Sundarbans mangrove forest. Stay in cozy eco-resorts, cruise through Sajnekhali, Sudhanyakhali, and Dobanki canopy walk.",
    thumbnail: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    featured_image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85",
    gallery_images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
    ],
    duration_days: 3,
    duration_nights: 2,
    total_price: 12000,
    adult_price: 6000,
    child_price: 3500,
    infant_price: 0,
    payment_type: "fixed",
    booking_amount: 3000,
    booking_percentage: 25,
    availability_status: "available",
    max_seats: 25,
    booked_seats: 8,
    featured: 0,
    status: "published",
    hotel_info: "Sundarban Tiger Camp / Royal Sundarban Eco Resort (AC Deluxe Forest Cottages)",
    transport_info: "Dedicated AC Vehicle transfer from Kolkata/Bongaon to Godkhali + Private Motorized Safari Boat.",
    meals_info: "All Meals Included: Fresh authentic Bengali cuisine (Breakfast, Lunch, Evening Snacks & Dinner).",
    important_notes: "Sundarbans is a plastic-free protected biosphere. Please carry Government photo IDs for forest permits.",
    terms_and_conditions: "Boat cruising is subject to tidal timings and Forest Department clearance.",
    cancellation_policy: "Free date rescheduling up to 5 days before travel.",
    inclusions: [
      "2 Nights accommodation in AC Eco Cottage at Sundarbans Resort",
      "All meals on boat and resort (Breakfast, Lunch, Snacks & Dinner)",
      "Private boat cruise across Sajnekhali, Sudhanyakhali & Dobanki",
      "Forest entry permits, guide fees, and camera permissions",
      "Local Baul folk music performance in the evening"
    ],
    exclusions: [
      "Personal expenses and tips",
      "Video camera charges as levied by Forest Dept"
    ],
    itinerary: [
      {
        day: 1,
        title: "Departure to Godkhali & Cruise to Sundarbans Eco Resort",
        description: "Morning pickup from Bongaon/Kolkata and drive to Godkhali jetty. Board luxury safari boat, cruise across rivers to resort. Visit bird sanctuary and enjoy evening Baul music."
      },
      {
        day: 2,
        title: "Full Day Mangrove Creek Safari — Sajnekhali, Sudhanyakhali & Dobanki",
        description: "Full day boat safari through narrow mangrove creeks. Visit Sajnekhali watchtower & museum, Sudhanyakhali tiger watchtower, and the famous Dobanki canopy walk."
      },
      {
        day: 3,
        title: "Village Walk, Mangrove Nursery & Return Transfer",
        description: "Morning guided walk through local delta village and mangrove restoration nursery. Post lunch, boat transfer to Godkhali and road drive back to Bongaon/Kolkata."
      }
    ]
  },
  {
    id: "PKG-KASH-06",
    package_id: "PKG-KASH-06",
    name: "Kashmir Paradise Valley — Srinagar, Gulmarg & Pahalgam",
    slug: "kashmir-paradise-valley-srinagar-gulmarg-pahalgam",
    destination: "Srinagar, Gulmarg, Pahalgam & Sonmarg",
    tour_category: "mountains",
    short_description: "Experience paradise on earth with luxury houseboat stays on Dal Lake, Shikara rides, snow activities in Gulmarg, and pine valleys of Pahalgam.",
    description: "The classic Kashmir holiday covering romantic Dal Lake Shikara rides, Mughal Gardens of Nishat and Shalimar, world-class Gulmarg Gondola snow rides, and scenic saffron fields of Pahalgam.",
    thumbnail: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    featured_image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=85",
    gallery_images: [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
    ],
    duration_days: 6,
    duration_nights: 5,
    total_price: 36000,
    adult_price: 18000,
    child_price: 11000,
    infant_price: 0,
    payment_type: "fixed",
    booking_amount: 8000,
    booking_percentage: 22,
    availability_status: "available",
    max_seats: 20,
    booked_seats: 7,
    featured: 1,
    status: "published",
    hotel_info: "Luxury Dal Lake Heritage Houseboat (1N) + 4-Star Mountain View Resorts in Pahalgam & Srinagar (4N)",
    transport_info: "Private Heated Sedan / SUV (Etios / Innova) for all transfers and sightseeing in Kashmir.",
    meals_info: "Daily Breakfast & Multi-Cuisine Kashmiri / Indian Dinner Buffet (MAP Plan). Welcome Kahwa.",
    important_notes: "Gulmarg Gondola tickets should be booked in advance online. Postpaid mobile connections (Airtel/Jio/BSNL) work in Kashmir.",
    terms_and_conditions: "Pony rides and local taxi in Pahalgam (Aru/Chandanwari) are governed by local union rates.",
    cancellation_policy: "Free date change up to 7 days before departure.",
    inclusions: [
      "1 Night in luxury carved wooden Houseboat on Dal Lake",
      "4 Nights in 4-Star deluxe hotels in Srinagar and Pahalgam",
      "Daily breakfast and dinner (MAP Plan)",
      "Romantic 1-hour sunset Shikara ride on Dal Lake",
      "Private AC/Heated vehicle for all transfers and tours",
      "Mughal Gardens entry: Nishat Bagh & Shalimar Bagh"
    ],
    exclusions: [
      "Gulmarg Gondola Phase 1 & 2 tickets (can be pre-booked)",
      "Pahalgam internal union taxi for Aru / Betaab Valley",
      "Flight tickets to/from Srinagar Airport"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar & Sunset Shikara Ride on Dal Lake",
        description: "Pickup from Srinagar Airport and transfer to luxury carved houseboat on Dal Lake. Enjoy a serene sunset Shikara ride visiting Floating Gardens and Char Chinar."
      },
      {
        day: 2,
        title: "Srinagar to Gulmarg Meadow of Flowers & Gondola Snow Ride",
        description: "Day excursion to Gulmarg (8,825 ft). Ride the world's highest Gondola cable car to Phase 1 & 2 for panoramic Himalayan snow vistas. Return to Srinagar."
      },
      {
        day: 3,
        title: "Srinagar to Pahalgam — Valley of Shepherds & Saffron Fields",
        description: "Scenic drive through saffron fields of Pampore and Awantipora ruins to Pahalgam (7,200 ft). Check in at resort along the Lidder River."
      },
      {
        day: 4,
        title: "Pahalgam Valley Exploration — Betaab Valley & Aru Valley",
        description: "Visit the postcard-perfect Betaab Valley named after the movie, Aru Valley meadows, and Chandanwari. Evening leisure by the roaring Lidder river."
      },
      {
        day: 5,
        title: "Mughal Gardens Tour & Old Srinagar Heritage Walk",
        description: "Transfer to Srinagar. Visit famous Mughal Gardens: Shalimar Bagh, Nishat Bagh, and Chashme Shahi. Explore Hazratbal Shrine and local Kashmiri saffron/dry fruit markets."
      },
      {
        day: 6,
        title: "Departure from Srinagar Airport",
        description: "After breakfast, check out from hotel. Transfer to Srinagar International Airport with fond memories of Paradise on Earth."
      }
    ]
  }
];
