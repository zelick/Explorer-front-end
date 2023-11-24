export interface Registration {
    name: string,
    surname: string,
    email: string,
    username: string,
    password: string,
    role: string,
    profilePicture: File | null,
    profilePictureUrl: string,
    biography: string,
    motto: string,
}