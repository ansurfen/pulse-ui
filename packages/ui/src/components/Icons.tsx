import { ComponentType } from "react";
import { Image, ImageResizeMode, ImageStyle, StyleProp } from "react-native";

export interface IconImageProps {
  size?: number;
  width?: number;
  height?: number;
  resizeMode?: ImageResizeMode;
  style?: StyleProp<ImageStyle>;
}

interface IconFactoryOptions {
  source: number;
  aspectRatio: number;
  defaultSize?: number;
}

function resolveDimensions(aspectRatio: number, size: number) {
  if (aspectRatio >= 1) {
    return {
      width: size,
      height: size / aspectRatio
    };
  }

  return {
    width: size * aspectRatio,
    height: size
  };
}

function createIconComponent({ source, aspectRatio, defaultSize = 48 }: IconFactoryOptions): ComponentType<IconImageProps> {
  return function PulseIcon({ size = defaultSize, width, height, resizeMode = "contain", style }: IconImageProps) {
    const fallback = resolveDimensions(aspectRatio, size);

    return (
      <Image
        resizeMode={resizeMode}
        source={source}
        style={[
          {
            width: width ?? fallback.width,
            height: height ?? fallback.height
          },
          style
        ]}
      />
    );
  };
}

export const CoinIcon = createIconComponent({
  source: require("../../assets/coin.png"),
  aspectRatio: 330 / 322
});

export const FireIcon = createIconComponent({
  source: require("../../assets/fire.png"),
  aspectRatio: 309 / 354
});

export const GemIcon = createIconComponent({
  source: require("../../assets/gem.png"),
  aspectRatio: 587 / 498
});

export const HeartIcon = createIconComponent({
  source: require("../../assets/heart.png"),
  aspectRatio: 359 / 314
});

export const LightningIcon = createIconComponent({
  source: require("../../assets/lightning.png"),
  aspectRatio: 263 / 367
});

export const GalleryIcon = createIconComponent({
  source: require("../../assets/gallery.png"),
  aspectRatio: 428 / 389
});

export const LockerIcon = createIconComponent({
  source: require("../../assets/locker.png"),
  aspectRatio: 641 / 858
});

export const LuggageIcon = createIconComponent({
  source: require("../../assets/luggage.png"),
  aspectRatio: 550 / 502
});

export const StoreIcon = createIconComponent({
  source: require("../../assets/store.png"),
  aspectRatio: 420 / 401
});

export const BookIcon = createIconComponent({
  source: require("../../assets/book.png"),
  aspectRatio: 256 / 230
});

export const StarIcon = createIconComponent({
  source: require("../../assets/star.png"),
  aspectRatio: 779 / 744
});
