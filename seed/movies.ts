//import {Movie, MovieCastMemberQueryParams} from '../shared/types'
import {Movie, MovieCast, Review} from '../shared/types'

export const movies : Movie[] = [
  {
    adult: false,
    backdrop_path: '/sRLC052ieEzkQs9dEtPMfFxYkej.jpg',
    genre_ids: [ 878 ],
    id: 848326,
    original_language: 'en',
    original_title: 'Rebel Moon - Part One: A Child of Fire',
    overview: 'When a peaceful colony on the edge of the galaxy finds itself threatened by the armies of the tyrannical Regent Balisarius, they dispatch Kora, a young woman with a mysterious past, to seek out warriors from neighboring planets to help them take a stand.',
    popularity: 2136.3,
    poster_path: '/6epeijccmJlnfvFitfGyfT7njav.jpg',
    release_date: '2023-12-15',
    title: 'Rebel Moon - Part One: A Child of Fire',
    video: false,
    vote_average: 6.4,
    vote_count: 750
  },
  {
    adult: false,
    backdrop_path: '/jXJxMcVoEuXzym3vFnjqDW4ifo6.jpg',
    genre_ids: [ 28, 12, 14 ],
    id: 572802,
    original_language: 'en',
    original_title: 'Aquaman and the Lost Kingdom',
    overview: "Black Manta, still driven by the need to avenge his father's death and wielding the power of the mythic Black Trident, will stop at nothing to take Aquaman down once and for all. To defeat him, Aquaman must turn to his imprisoned brother Orm, the former King of Atlantis, to forge an unlikely alliance in order to save the world from irreversible destruction.",
    popularity: 1605.303,
    poster_path: '/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg',
    release_date: '2023-12-20',
    title: 'Aquaman and the Lost Kingdom',
    video: false,
    vote_average: 6.5,
    vote_count: 299
  },
  {
    adult: false,
    backdrop_path: '/5a4JdoFwll5DRtKMe7JLuGQ9yJm.jpg',
    genre_ids: [ 18, 878, 28 ],
    id: 695721,
    original_language: 'en',
    original_title: 'The Hunger Games: The Ballad of Songbirds & Snakes',
    overview: '64 years before he becomes the tyrannical president of Panem, Coriolanus Snow sees a chance for a change in fortunes when he mentors Lucy Gray Baird, the female tribute from District 12.',
    popularity: 1509.974,
    poster_path: '/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg',
    release_date: '2023-11-15',
    title: 'The Hunger Games: The Ballad of Songbirds & Snakes',
    video: false,
    vote_average: 7.2,
    vote_count: 1181
  },
  {
    adult: false,
    backdrop_path: '/15Fe18IglCCP1jJoj5F529on0IA.jpg',
    genre_ids: [ 28, 35 ],
    id: 1029575,
    original_language: 'en',
    original_title: 'The Family Plan',
    overview: "Dan Morgan is many things: a devoted husband, a loving father, a celebrated car salesman. He's also a former assassin. And when his past catches up to his present, he's forced to take his unsuspecting family on a road trip unlike any other.",
    popularity: 954.371,
    poster_path: '/jLLtx3nTRSLGPAKl4RoIv1FbEBr.jpg',
    release_date: '2023-12-14',
    title: 'The Family Plan',
    video: false,
    vote_average: 7.3,
    vote_count: 457
  },
  {
    adult: false,
    backdrop_path: '/bmlkLCjrIWnnZzdAQ4uNPG9JFdj.jpg',
    genre_ids: [ 35, 10751, 14 ],
    id: 787699,
    original_language: 'en',
    original_title: 'Wonka',
    overview: 'Willy Wonka – chock-full of ideas and determined to change the world one delectable bite at a time – is proof that the best things in life begin with a dream, and if you’re lucky enough to meet Willy Wonka, anything is possible.',
    popularity: 949.214,
    poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
    release_date: '2023-12-06',
    title: 'Wonka',
    video: false,
    vote_average: 7.2,
    vote_count: 703
  },
  {
    adult: false,
    backdrop_path: '/gg4zZoTggZmpAQ32qIrP5dtnkEZ.jpg',
    genre_ids: [ 28, 80 ],
    id: 891699,
    original_language: 'en',
    original_title: 'Silent Night',
    overview: "A tormented father witnesses his young son die when caught in a gang's crossfire on Christmas Eve. While recovering from a wound that costs him his voice, he makes vengeance his life's mission and embarks on a punishing training regimen in order to avenge his son's death.",
    popularity: 945.22,
    poster_path: '/tlcuhdNMKNGEVpGqBZrAaOOf1A6.jpg',
    release_date: '2023-11-30',
    title: 'Silent Night',
    video: false,
    vote_average: 5.8,
    vote_count: 181
  },
  {
    adult: false,
    backdrop_path: '/1pFSJ9lxMYLkgLS5gmnwm1AEiqx.jpg',
    genre_ids: [ 878 ],
    id: 798141,
    original_language: 'en',
    original_title: 'Doors',
    overview: 'Without warning, millions of mysterious alien “doors” suddenly appear around the globe. In a rush to determine the reason for their arrival, mankind must work together to understand the purpose of these cosmic anomalies.',
    popularity: 752.379,
    poster_path: '/pGPUXyhQTOqskKdDOD3Fmicqfc0.jpg',
    release_date: '2021-03-23',
    title: 'Doors',
    video: false,
    vote_average: 5,
    vote_count: 119
  },
  {
    adult: false,
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    genre_ids: [ 18, 36 ],
    id: 872585,
    original_language: 'en',
    original_title: 'Oppenheimer',
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    popularity: 746.349,
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    release_date: '2023-07-19',
    title: 'Oppenheimer',
    video: false,
    vote_average: 8.1,
    vote_count: 5713
  },
  {
    adult: false,
    backdrop_path: '/9jPoyxjiEYPylUIMI3Ntixf8z3M.jpg',
    genre_ids: [ 16, 12, 35, 10751 ],
    id: 520758,
    original_language: 'en',
    original_title: 'Chicken Run: Dawn of the Nugget',
    overview: "A band of fearless chickens flock together to save poultry-kind from an unsettling new threat: a nearby farm that's cooking up something suspicious.",
    popularity: 494.214,
    poster_path: '/exNtEY8QUuQh9e23wSQjkPxKIU3.jpg',
    release_date: '2023-12-08',
    title: 'Chicken Run: Dawn of the Nugget',
    video: false,
    vote_average: 7.4,
    vote_count: 325
  }
]
export const movieCasts: MovieCast[] = [
  {
    movieId: 1234,
    actorName: "Joe Bloggs",
    roleName: "Male Character 1",
    roleDescription: "description of character 1",
  },
  {
    movieId: 1234,
    actorName: "Alice Broggs",
    roleName: "Female Character 1",
    roleDescription: "description of character 2",
  },
  {
    movieId: 1234,
    actorName: "Joe Cloggs",
    roleName: "Male Character 2",
    roleDescription: "description of character 3",
  },
  {
    movieId: 2345,
    actorName: "Joe Bloggs",
    roleName: "Male Character 1",
    roleDescription: "description of character 3",
  },
]
export const movieReviews: Review[] = [
  {
    movieId: 848326,
    reviewId: 1001,
    ReviewerId: "roy@gmail.com",
    ReviewDate: "2025-01-15",
    Content: "A thrilling sci-fi experience with a great storyline."
  },
  {
    movieId: 848326,
    reviewId: 1002,
    ReviewerId: "das@gmail.com",
    ReviewDate: "2025-01-18",
    Content: "Fantastic visuals and world-building!"
  },
  {
    movieId: 572802,
    reviewId: 1003,
    ReviewerId: "Keeran@gmail.com",
    ReviewDate: "2025-01-20",
    Content: "Could have been better in terms of pacing."
  }
];



