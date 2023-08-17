import React, { useState } from 'react';
import { ReactComponent as ReviewStarIcon } from 'assets/images/mypageReviewStar.svg';
import './ratingStars.scss';

interface RatingStarsProps {
  rating: number;
  width?: string;
  height?: string;
  color?: string;
  onClick?: (rating: number) => void;
  hoverable?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  width = '11px',
  height = '11px',
  color = '#ff611d',
  onClick,
  hoverable = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <div
      className={`rating-stars ${hoverable ? 'hoverable' : ''}`}
      style={{ '--filled-color': color } as React.CSSProperties}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <ReviewStarIcon
          key={index}
          className={`rating-star ${
            index < (hoverable && hoveredIndex !== -1 ? hoveredIndex + 1 : rating)
              ? 'filled'
              : 'empty'
          }`}
          style={{ width, height }}
          onClick={() => onClick?.(index + 1)}
          onMouseEnter={() => hoverable && setHoveredIndex(index)}
          onMouseLeave={() => hoverable && setHoveredIndex(-1)}
        />
      ))}
    </div>
  );
};

export default RatingStars;
