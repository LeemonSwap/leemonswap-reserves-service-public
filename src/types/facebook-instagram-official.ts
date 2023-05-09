export interface FacebookPageList {
    name: string;
    id: string;
}

export interface FacebookPageConnectedInstagramAccountResponse {
    connected_instagram_account: { id: string };
    id: string;
}

export interface FacebookInstagramAccountInfoResponse {
    biography: string;
    followers_count: number;
    follows_count: number;
    ig_id: number;
    profile_picture_url: string;
    website: string;
    id: string;
    username: string;
}

export interface FacebookCheckTokenResponse {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface CheckPermissionInfos {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
}

export interface FacebookInstagramMediasResponse {
    data: FacebookInstagramMedia[];
    paging: FacebookCursor;
}

export interface FacebookInstagramMedia {
    caption: string;
    media_url: string;
    media_type: string;
    shortcode: string;
    permalink: string;
    id: string;
}

export interface FacebookInstagramAccountTagResponse {
    data: FacebookInstagramMedia[];
}

export interface FacebookInstagramStoriesResponse {
    data: FacebookInstagramMedia[];
    paging: FacebookCursor;
}

export interface FacebookInstagramInsightsGenderAndRange {
    genderAndRange: string;
    value: number;
}

export interface FacebookInstagramInsightsTopCities {
    city: string;
    value: number;
}

export interface FacebookInstagramMixedInsights {
    reach: number;
    avgReach: number;
    profileViews: number;
    avgProfileViews: number;
    impressions: number;
    avgImpressions: number;
    topCities: FacebookInstagramInsightsTopCities[];
    genderAndRange: FacebookInstagramInsightsGenderAndRange[];
}

export interface FacebookInstagramInsightsDataValues {
    value: number;
    end_time: string;
}

export interface FacebookCursor {
    cursors: {
        before: string;
        after: string;
    };
}

export interface FacebookPaging {
    previous: string;
    next: string;
}

export interface FacebookInstagramInsightsData {
    name: string;
    period: string;
    values: FacebookInstagramInsightsDataValues[];
    title: string;
    description: string;
    id: string;
}

export interface FacebookInstagramInsightsResponse {
    data: FacebookInstagramInsightsData[];
    paging: FacebookPaging;
}
