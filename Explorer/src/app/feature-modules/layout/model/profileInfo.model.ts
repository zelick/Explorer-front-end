export interface ProfileInfo {
    id: number;
    userId: number;
    name: string;
    surname: string;
    email: string;
    profilePicture: File | null;
    profilePictureUrl: string;
    biography: string;
    motto: string;
  }