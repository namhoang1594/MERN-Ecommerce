export interface FeatureImage {
    _id: string;
    image: string;
}

export interface CommonFeatureState {
    isLoading: boolean;
    featureImageList: FeatureImage[];
}
