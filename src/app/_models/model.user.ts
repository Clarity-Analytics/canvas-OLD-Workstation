export class User {
    pk: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    profile: {
        nick_name: string,
        cell_number: string,
        work_number: string;
        profile_picture: URL;
    };
    date_joined: Date;
    last_login: Date;
    url: URL;
}