export interface IMovie {
  tconst?: string;
  titleType?: string;
  primaryTitle?: string;
  originalTitle?: string;
  isAdult?: string;
  startYear?: string;
  endYear?: string;
  runtimeMinutes?: string;
  genre?: string;
  averageRating?: string;
  numVotes?: string;
}

export interface IPagination {
  page?: string;
  limit?: string;
}
