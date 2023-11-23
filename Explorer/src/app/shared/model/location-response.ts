export interface LocationResponse {
    lat: number;
    lon: number;
    display_name: string;
    address: {
        house_number?: string;
        road?: string;
        neighbourhood?: string;
        quarter?: string;
        suburb?: string;
        city?: string;
        county?: string;
        state?: string;
        postcode?: string;
        country?: string;
        city_district?: string;
    };
}