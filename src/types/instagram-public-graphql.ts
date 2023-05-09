export interface InstagramV1UserInfoResponse {
    user: {
        pk: number;
        username: string;
        full_name: string;
        is_private: boolean;
        profile_pic_url: string;
        profile_pic_id: string;
        is_verified: boolean;
        has_anonymous_profile_picture: boolean;
        media_count: number;
        follower_count: number;
        following_count: number;
        following_tag_count: number;
        biography: string;
        external_url: string;
        external_lynx_url: string;
        total_igtv_videos: number;
        total_ar_effects: number;
        usertags_count: number;
        is_interest_account: boolean;
        hd_profile_pic_versions: [
            {
                width: number;
                height: number;
                url: string;
            },
        ];
        hd_profile_pic_url_info: {
            width: number;
            height: number;
            url: string;
        };
        has_highlight_reels: boolean;
        can_be_reported_as_fraud: boolean;
        is_potential_business: boolean;
        auto_expand_chaining: boolean;
        highlight_reshare_disabled: boolean;
    };
    status: string;
}

export interface InstagramGraphQLCount {
    count: number;
}

export interface InstagramGraphQLUserInfo {
    user: {
        biography: string;
        blocked_by_viewer: boolean;
        country_block: boolean;
        external_url: string;
        external_url_linkshimmed: string;
        edge_followed_by: InstagramGraphQLCount;
        followed_by_viewer: boolean;
        edge_follow: InstagramGraphQLCount;
        follows_viewer: boolean;
        full_name: string;
        has_channel: boolean;
        has_blocked_viewer: boolean;
        highlight_reel_count: number;
        has_requested_viewer: boolean;
        id: string;
        is_business_account: boolean;
        is_joined_recently: boolean;
        business_category_name: string;
        is_private: boolean;
        is_verified: boolean;
        edge_mutual_followed_by: [Record<string, unknown>];
        profile_pic_url: string;
        profile_pic_url_hd: string;
        requested_by_viewer: boolean;
        username: string;
        connected_fb_page: string;
        edge_felix_video_timeline: [Record<string, unknown>];
        edge_owner_to_timeline_media: [Record<string, unknown>];
        edge_saved_media: [Record<string, unknown>];
        edge_media_collections: [Record<string, unknown>];
    };
}

export interface InstagramGraphQLUserInfoResponse {
    logging_page_id: string;
    show_suggested_profiles: boolean;
    graphql: InstagramGraphQLUserInfo;
    show_follow_dialog: boolean;
}
