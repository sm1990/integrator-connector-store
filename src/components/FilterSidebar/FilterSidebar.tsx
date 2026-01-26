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

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
} from '@wso2/oxygen-ui';
import { ChevronDown as ExpandMoreIcon } from '@wso2/oxygen-ui-icons-react';
import { FilterOptions } from '@/types/connector';
import SearchBar from '@/components/SearchBar';

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  selectedAreas: string[];
  selectedVendors: string[];
  selectedTypes: string[];
  searchQuery: string;
  onAreaChange: (area: string) => void;
  onVendorChange: (vendor: string) => void;
  onTypeChange: (type: string) => void;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
}

export default function FilterSidebar({
  filterOptions,
  selectedAreas,
  selectedVendors,
  selectedTypes,
  searchQuery,
  onAreaChange,
  onVendorChange,
  onTypeChange,
  onSearchChange,
  onClearAll,
}: FilterSidebarProps) {
  const totalFiltersActive = selectedAreas.length + selectedVendors.length + selectedTypes.length;
  const areaScrollRef = useRef<HTMLDivElement>(null);
  const vendorScrollRef = useRef<HTMLDivElement>(null);
  const typeScrollRef = useRef<HTMLDivElement>(null);
  const [showAreaScroll, setShowAreaScroll] = useState(false);
  const [showVendorScroll, setShowVendorScroll] = useState(false);
  const [showTypeScroll, setShowTypeScroll] = useState(false);

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = (
      ref: React.RefObject<HTMLDivElement | null>,
      setter: (value: boolean) => void
    ) => {
      if (ref.current) {
        const { scrollHeight, clientHeight } = ref.current;
        setter(scrollHeight > clientHeight);
      }
    };

    checkScrollable(areaScrollRef, setShowAreaScroll);
    checkScrollable(vendorScrollRef, setShowVendorScroll);
    checkScrollable(typeScrollRef, setShowTypeScroll);
  }, [filterOptions]);

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'sticky',
        top: 88,
        borderRadius: '8px',
        border: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        p: 2,
      }}
    >
      {/* Search Bar */}
      <Box mb={2}>
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </Box>

      {/* Area Filter */}
      <Box
        sx={{
          mb: 1.5,
          borderRadius: '8px',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F5F5F5',
        }}
      >
        <Accordion
          defaultExpanded
          disableGutters
          elevation={0}
          sx={{
            '&:before': {
              display: 'none',
            },
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              p: 1.5,
              minHeight: 36,
              alignItems: 'center',
              '& .MuiAccordionSummary-content': {
                margin: 0,
              },
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
              Area {selectedAreas.length > 0 && `(${selectedAreas.length})`}
            </Typography>
          </AccordionSummary>
          <Box sx={{ position: 'relative' }}>
            <AccordionDetails
              ref={areaScrollRef}
              sx={{
                px: 1.5,
                pt: 0,
                pb: 1.5,
                maxHeight: '192px',
                overflowY: 'auto',
              }}
            >
              <FormGroup>
                {filterOptions.areas.map((area) => (
                  <FormControlLabel
                    key={area}
                    control={
                      <Checkbox
                        checked={selectedAreas.includes(area)}
                        onChange={() => onAreaChange(area)}
                        sx={{
                          '& .MuiSvgIcon-root': { fontSize: 16 },
                          color: '#52525B',
                          '&.Mui-checked': { color: '#FF7300' },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.875rem' }}>{area}</Typography>}
                    sx={{
                      mx: 0,
                      px: 1,
                      py: 0.25,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#3F3F46' : '#E5E7EB',
                      },
                    }}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
            {showAreaScroll && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40px',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(to bottom, transparent, rgba(26, 26, 26, 0.9))'
                      : 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9))',
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>
        </Accordion>
      </Box>

      {/* Type Filter */}
      <Box
        sx={{
          mb: 1.5,
          borderRadius: '8px',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(39, 39, 42, 0.5)' : '#F9FAFB',
        }}
      >
        <Accordion
          disableGutters
          elevation={0}
          sx={{
            '&:before': {
              display: 'none',
            },
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              p: 1.5,
              minHeight: 36,
              alignItems: 'center',
              '& .MuiAccordionSummary-content': {
                margin: 0,
              },
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
              Type {selectedTypes.length > 0 && `(${selectedTypes.length})`}
            </Typography>
          </AccordionSummary>
          <Box sx={{ position: 'relative' }}>
            <AccordionDetails
              ref={typeScrollRef}
              sx={{
                px: 1.5,
                pt: 0,
                pb: 1.5,
                maxHeight: '192px',
                overflowY: 'auto',
              }}
            >
              <FormGroup>
                {filterOptions.types.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={selectedTypes.includes(type)}
                        onChange={() => onTypeChange(type)}
                        sx={{
                          '& .MuiSvgIcon-root': { fontSize: 16 },
                          color: '#52525B',
                          '&.Mui-checked': { color: '#FF7300' },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.875rem' }}>{type}</Typography>}
                    sx={{
                      mx: 0,
                      px: 1,
                      py: 0.25,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#3F3F46' : '#E5E7EB',
                      },
                    }}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
            {showTypeScroll && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40px',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(to bottom, transparent, rgba(26, 26, 26, 0.9))'
                      : 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9))',
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>
        </Accordion>
      </Box>

      {/* Vendor Filter */}
      <Box
        sx={{
          mb: 0,
          borderRadius: '8px',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(39, 39, 42, 0.5)' : '#F9FAFB',
        }}
      >
        <Accordion
          disableGutters
          elevation={0}
          sx={{
            '&:before': {
              display: 'none',
            },
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              p: 1.5,
              minHeight: 36,
              alignItems: 'center',
              '& .MuiAccordionSummary-content': {
                margin: 0,
              },
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
              Vendor {selectedVendors.length > 0 && `(${selectedVendors.length})`}
            </Typography>
          </AccordionSummary>
          <Box sx={{ position: 'relative' }}>
            <AccordionDetails
              ref={vendorScrollRef}
              sx={{
                px: 1.5,
                pt: 0,
                pb: 1.5,
                maxHeight: '192px',
                overflowY: 'auto',
              }}
            >
              <FormGroup>
                {filterOptions.vendors.map((vendor) => (
                  <FormControlLabel
                    key={vendor}
                    control={
                      <Checkbox
                        checked={selectedVendors.includes(vendor)}
                        onChange={() => onVendorChange(vendor)}
                        sx={{
                          '& .MuiSvgIcon-root': { fontSize: 16 },
                          color: '#52525B',
                          '&.Mui-checked': { color: '#FF7300' },
                        }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.875rem' }}>{vendor}</Typography>}
                    sx={{
                      mx: 0,
                      px: 1,
                      py: 0.25,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#3F3F46' : '#E5E7EB',
                      },
                    }}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
            {showVendorScroll && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40px',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(to bottom, transparent, rgba(26, 26, 26, 0.9))'
                      : 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9))',
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>
        </Accordion>
      </Box>
    </Paper>
  );
}
