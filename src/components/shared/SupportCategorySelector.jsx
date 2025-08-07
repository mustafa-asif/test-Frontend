import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';
import { useTranslation } from '../../i18n/provider';

function SupportCategorySelector({ supportCategories, handleSupportCategorySend }) {
    const tl = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedSubCategory('');

        if (!supportCategories[category]?.length) {
            handleSupportCategorySend(category);
        }
    };

    const handleSubCategoryClick = (subCategory) => {
        setSelectedSubCategory(subCategory);
        handleSupportCategorySend(selectedCategory, subCategory);
    };

    return (
        <Box className="p-4">
            <Box className="mb-4">
                <h3 className="text-base font-bold mb-2 text-right">{tl("choose_support_category")}</h3>
                <Box className="flex flex-wrap justify-end gap-y-4">
                    {Object.keys(supportCategories).map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            clickable
                            onClick={() => handleCategoryClick(category)}
                            color={selectedCategory === category ? 'success' : 'default'}
                            sx={{
                                mr: 1,
                                padding: '0.5rem 1rem',
                                fontSize: '1rem',
                                maxWidth: '300px',
                                whiteSpace: 'normal',
                                height: 'auto',
                                '& .MuiChip-label': {
                                    whiteSpace: 'normal',
                                    display: 'block',
                                    textAlign: 'right',
                                    padding: '0.25rem 0'
                                }
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {(selectedCategory && supportCategories[selectedCategory].length > 0) && (
                <Box className="mt-4">
                    <h3 className="text-base font-bold mb-2 text-right">{tl("choose_support_subcategory")}</h3>
                    <Box className="flex flex-wrap justify-end gap-y-4">
                        {supportCategories[selectedCategory].map((subCategory) => (
                            <Chip
                                key={subCategory}
                                label={subCategory}
                                clickable
                                onClick={() => handleSubCategoryClick(subCategory)}
                                color={selectedSubCategory === subCategory ? 'success' : 'default'}
                                sx={{
                                    mr: 1,
                                    padding: '0.5rem 1rem',
                                    fontSize: '1rem',
                                    maxWidth: '300px',
                                    whiteSpace: 'normal',
                                    height: 'auto',
                                    '& .MuiChip-label': {
                                        whiteSpace: 'normal',
                                        display: 'block',
                                        textAlign: 'right',
                                        padding: '0.25rem 0'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default SupportCategorySelector;
