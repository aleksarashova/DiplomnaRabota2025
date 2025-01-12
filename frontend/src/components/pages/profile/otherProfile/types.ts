export type OtherUserData = {
    first_name: string;
    last_name: string;
    username: string;
    bio: string;
    image: string;
    recipes: string[];
}

export type RateUserData = {
    userBeingRated: string;
    rating: number;
}

export type Rating = {
    raterId: string;
    rating: number;
}