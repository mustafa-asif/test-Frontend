import React from 'react';
import Rating from '@mui/material/Rating';
import { Box, Typography } from '@mui/material';
import { useTranslation } from '../../i18n/provider';
import { useToast } from '../../hooks/useToast';
import { xFetch } from '../../utils/constants';
import { RatingIconsLables } from '../../utils/misc';


const icons = {
    1: {
        icon: '😞',
        label: RatingIconsLables.VERY_DISSATISFIED,
        color: 'text-red-500'
    },
    2: {
        icon: '😟',
        label: RatingIconsLables.DISSATISFIED,
        color: 'text-red-400'
    },
    3: {
        icon: '😐',
        label: RatingIconsLables.NEUTRAL,
        color: 'text-yellow-500'
    },
    4: {
        icon: '😊',
        label: RatingIconsLables.SATISFIED,
        color: 'text-green-500'
    },
    5: {
        icon: '😁',
        label: RatingIconsLables.VERY_SATISFIED,
        color: 'text-green-500'
    },
};

const ratingValues = {
    [RatingIconsLables.VERY_DISSATISFIED]: 1,
    [RatingIconsLables.DISSATISFIED]: 2,
    [RatingIconsLables.NEUTRAL]: 3,
    [RatingIconsLables.SATISFIED]: 4,
    [RatingIconsLables.VERY_SATISFIED]: 5
}

const IconContainer = (props) => {
    const { value, ...other } = props;
    other.className += ` m-1 ${icons[value].color}`;
    return <span {...other}>{icons[value].icon}</span>;
};

const ratingTitles = {
    'order': "Rate your order",
    'pickup':"Rate your pickup",
    'support': "Evaluate our support",
}

export const RatingComponent = function ({ model, _id, type, rating, disabled }) {
    rating = ratingValues[rating];
    const tl = useTranslation();
    const showToast = useToast();
    async function saveRating(newRating) {
        const { error } = await xFetch(`/${model}/${_id}/rating`, {
            method: "PATCH",
            body: {
                rateType: type,
                rating: icons[newRating].label
            },
        });
        if (error) {
            return showToast(error, "error");
        }
        showToast(tl("Thanks for rating!"), "success");
    }

    return (
        <div className="rating-component w-full">
            <Box
                sx={{
                    maxWidth: 400,
                    mx: 'auto',
                    p: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <Typography className='font-bold' component="legend">{tl(ratingTitles[type])}</Typography>
                <Rating
                    name="customized-icons"
                    onChange={(event, newValue) => {
                        saveRating(newValue)
                    }}
                    readOnly={disabled}
                    defaultValue={rating}
                    getLabelText={(value) => value && icons[value].label}
                    IconContainerComponent={IconContainer}
                    highlightSelectedOnly
                />
            </Box>
        </div>

    );
}