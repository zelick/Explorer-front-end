export interface ElevationResponse {
    results: Array<{
        latitude: number;
        longitude: number;
        elevation: number;
    }>;
}