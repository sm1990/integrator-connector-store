/*
 Copyright (c) 2026 WSO2 LLC. (http://www.wso2.com) All Rights Reserved.

 WSO2 LLC. licenses this file to you under the Apache License,
 Version 2.0 (the "License"); you may not use this file except
 in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
*/

import React from 'react';
import { Box, Select, MenuItem, Typography, Button, FormControl } from '@wso2/oxygen-ui';
import {
  ChevronLeft as NavigateBeforeIcon,
  ChevronRight as NavigateNextIcon,
} from '@wso2/oxygen-ui-icons-react';
import { SortOption } from '@/lib/connector-utils';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  sortBy: SortOption;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (sort: SortOption) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  sortBy,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  pageSizeOptions = [10, 30, 50, 100],
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        backgroundColor: 'background.paper',
        borderRadius: '8px',
        px: 1.5,
        py: 1,
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Left side - Per page, Showing, and Sort by */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {/* Per page */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap', color: '#71717A' }}>
            Per page
          </Typography>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              displayEmpty
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
              }}
            >
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size} Items
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Showing info */}
        <Typography 
          variant="body2" 
          sx={{ 
            whiteSpace: 'nowrap', 
            color: 'text.secondary'
          }}
        >
          Showing {startItem}-{endItem} of {totalItems}
        </Typography>

        {/* Sort by */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap', color: '#71717A' }}>
            Sort by
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              displayEmpty
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
              }}
            >
              <MenuItem value="pullCount-desc">Most Popular</MenuItem>
              <MenuItem value="pullCount-asc">Least Popular</MenuItem>
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
              <MenuItem value="date-desc">Newest First</MenuItem>
              <MenuItem value="date-asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Right side - Page navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          size="small"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="text"
          sx={{ 
            minWidth: 'auto',
            textTransform: 'none',
            color: currentPage === 1 ? 'text.disabled' : 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <NavigateBeforeIcon size={20} />
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2">...</Typography>
                </Box>
              ) : (
                <Button
                  size="small"
                  variant={currentPage === page ? 'contained' : 'text'}
                  onClick={() => onPageChange(page as number)}
                  sx={{
                    minWidth: '40px',
                    px: 1,
                    borderRadius: 1,
                    ...(currentPage === page && {
                      backgroundColor: '#FF7300',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#E66700',
                      },
                    }),
                    ...currentPage !== page && {
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    },
                  }}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </Box>

        <Button
          size="small"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="text"
          sx={{ 
            minWidth: 'auto',
            textTransform: 'none',
            color: currentPage === totalPages ? 'text.disabled' : 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          Next
          <NavigateNextIcon size={20} />
        </Button>
      </Box>
    </Box>
  );
}
