export interface Scene {
  id: string;
  image: string;
  title: string;
  fact: string;
  evidence: string;
  truthClassification: 'VERIFIED' | 'QUALIFIED' | 'RECONSTRUCTED' | 'FICTION';
}

export const LEARNING_DATA: Record<string, Scene[]> = {
  nalanda: [
    { id: 'nalanda-1', image: '/destinations/nalanda-hero.png', title: 'The Great Mahavihara', fact: 'Nalanda was one of the first residential universities in the world, accommodating over 10,000 students and 2,000 teachers.', evidence: 'Excavated monastic cells and accounts by Xuanzang (7th Century CE).', truthClassification: 'VERIFIED' },
    { id: 'nalanda-2', image: '/destinations/nalanda-detail.png', title: 'Dharmaganja Library', fact: 'The library complex consisted of three massive multi-story buildings: Ratnasagara, Ratnodadhi, and Ratnaranjaka.', evidence: 'Tibetan historical records (Pag Sam Jon Zang).', truthClassification: 'QUALIFIED' },
    { id: 'nalanda-3', image: '/destinations/nalanda-hero.png', title: 'Monastic Architecture', fact: 'The campus featured red brick construction with advanced drainage systems and large meditation courtyards.', evidence: 'ASI Excavation Reports (1915-1937, 1974-1982).', truthClassification: 'VERIFIED' },
    { id: 'nalanda-4', image: '/destinations/nalanda-detail.png', title: 'Global Scholars', fact: 'Scholars traveled from Korea, Japan, China, Tibet, Indonesia, and Persia to study logic, medicine, grammar, and Buddhist philosophy.', evidence: 'I-Tsing travelogues.', truthClassification: 'VERIFIED' },
  ],
  pataliputra: [
    { id: 'pat-1', image: '/destinations/pataliputra-hero.png', title: 'Imperial Capital', fact: 'Pataliputra was the fortified capital of the Maurya Empire, one of the largest cities in the ancient world.', evidence: 'Megasthenes\' Indica and Arthashastra.', truthClassification: 'VERIFIED' },
    { id: 'pat-2', image: '/destinations/pataliputra-detail.png', title: 'Wooden Palisade', fact: 'The city was surrounded by a massive wooden palisade with 64 gates and 570 towers.', evidence: 'Bulandibagh excavations finding wooden remnants.', truthClassification: 'VERIFIED' },
    { id: 'pat-3', image: '/destinations/pataliputra-hero.png', title: 'The 80-Pillared Hall', fact: 'A massive assembly hall modeled on Achaemenid architecture existed in Kumhrar.', evidence: 'Spooner excavations (1912).', truthClassification: 'QUALIFIED' },
    { id: 'pat-4', image: '/destinations/pataliputra-detail.png', title: 'Strategic Location', fact: 'Positioned at the confluence of the Ganga, Son, and Punpun rivers, offering immense trade and military advantages.', evidence: 'Geographical continuity and ancient texts.', truthClassification: 'VERIFIED' },
  ],
  hampi: [
    { id: 'ham-1', image: '/destinations/hampi-hero.png', title: 'Vijayanagara', fact: 'Hampi was the imperial capital of the Vijayanagara Empire, described as the second-largest medieval-era city after Beijing.', evidence: 'Accounts of Abdur Razzaq and Domingo Paes.', truthClassification: 'VERIFIED' },
    { id: 'ham-2', image: '/destinations/hampi-detail.png', title: 'Bazaar Streets', fact: 'Wide chariot streets lined with pillared pavilions functioned as international markets trading diamonds, pearls, and horses.', evidence: 'Archaeological remains of Hampi Bazaar.', truthClassification: 'VERIFIED' },
    { id: 'ham-3', image: '/destinations/hampi-hero.png', title: 'Hydraulic Systems', fact: 'Advanced aqueducts and tanks (like Pushkarini) managed water across the arid rocky landscape.', evidence: 'Extant stone aqueducts in the Royal Enclosure.', truthClassification: 'VERIFIED' },
    { id: 'ham-4', image: '/destinations/hampi-detail.png', title: 'Musical Pillars', fact: 'The Vittala Temple contains stone pillars that emit musical notes when struck.', evidence: 'Standing structure, acoustic studies.', truthClassification: 'VERIFIED' },
  ],
  varanasi: [
    { id: 'var-1', image: '/destinations/varanasi-hero.png', title: 'The Living City', fact: 'Varanasi is one of the oldest continuously inhabited cities in the world, central to Hindu, Buddhist, and Jain traditions.', evidence: 'Radiocarbon dating from Rajghat excavations (800 BCE).', truthClassification: 'VERIFIED' },
    { id: 'var-2', image: '/destinations/varanasi-detail.png', title: 'The Riverfront Ghats', fact: 'The crescent-shaped riverfront features over 80 ghats built by Maratha, Rajput, and regional rulers.', evidence: 'Extant architecture.', truthClassification: 'VERIFIED' },
    { id: 'var-3', image: '/destinations/varanasi-hero.png', title: 'Sarnath Connection', fact: 'Just outside the city lies Sarnath, where the Buddha gave his first sermon.', evidence: 'Dhamek Stupa and Ashokan Pillar.', truthClassification: 'VERIFIED' },
    { id: 'var-4', image: '/destinations/varanasi-detail.png', title: 'Textile Heritage', fact: 'The city has been a legendary center for silk weaving (Banarasi sarees) since ancient times.', evidence: 'Jataka tales mentioning Kasi fabrics.', truthClassification: 'QUALIFIED' },
  ],
  madurai: [
    { id: 'mad-1', image: '/destinations/madurai-hero.png', title: 'The Lotus City', fact: 'Madurai was designed in the shape of a lotus, centered around the Meenakshi Amman Temple.', evidence: 'Silappatikaram descriptions and urban plan.', truthClassification: 'QUALIFIED' },
    { id: 'mad-2', image: '/destinations/madurai-detail.png', title: 'Sangam Academies', fact: 'The city was the seat of the mythical Tamil Sangams (poetic academies) supported by Pandya Kings.', evidence: 'Sangam literature (e.g., Kalithogai, Paripadal).', truthClassification: 'QUALIFIED' },
    { id: 'mad-3', image: '/destinations/madurai-hero.png', title: 'Gopuram Architecture', fact: 'The temple complex features 14 towering gateways covered in thousands of painted stucco figures.', evidence: 'Extant architecture.', truthClassification: 'VERIFIED' },
    { id: 'mad-4', image: '/destinations/madurai-detail.png', title: 'Trade Center', fact: 'Madurai had extensive trade links with Rome and Greece, exporting spices, pearls, and cotton.', evidence: 'Roman coins found in the region and Ptolemy\'s accounts.', truthClassification: 'VERIFIED' },
  ],
  konark: [
    { id: 'kon-1', image: '/destinations/konark-hero.png', title: 'The Black Pagoda', fact: 'The Sun Temple was designed as a massive cosmic chariot of the Sun God Surya with 24 wheels and 7 horses.', evidence: 'Standing monument (13th Century CE).', truthClassification: 'VERIFIED' },
    { id: 'kon-2', image: '/destinations/konark-detail.png', title: 'Time-Keeping Wheels', fact: 'The wheels function as precise sundials, calculating time to the exact minute based on shadow length.', evidence: 'Practical demonstration on the stone wheels.', truthClassification: 'VERIFIED' },
    { id: 'kon-3', image: '/destinations/konark-hero.png', title: 'Iron Beams', fact: 'Massive forge-welded iron beams were used to support the heavy stone ceilings.', evidence: 'Rusted iron beams lying in the temple precinct.', truthClassification: 'VERIFIED' },
    { id: 'kon-4', image: '/destinations/konark-detail.png', title: 'Lodestone Legend', fact: 'Legend claims a giant lodestone at the top caused shipwrecks by disrupting compasses.', evidence: 'Portuguese maritime folklore.', truthClassification: 'FICTION' },
  ],
};
