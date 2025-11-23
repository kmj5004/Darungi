export interface BikeStation {
  stationName: string;
  stationLatitude: string;
  stationLongitude: string;
  parkingBikeTotCnt: string; // API returns this as a string
  rackTotCnt: string;
  shared: string;
  stationId: string;
}

export interface SeoulBikeResponse {
  rentBikeStatus: {
    list_total_count: number;
    RESULT: {
      CODE: string;
      MESSAGE: string;
    };
    row: BikeStation[];
  };
}
