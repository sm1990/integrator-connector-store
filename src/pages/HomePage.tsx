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

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, useColorScheme } from '@wso2/oxygen-ui';
import { Zap, Shield, Globe } from '@wso2/oxygen-ui-icons-react';
import { BallerinaPackage, FilterOptions } from '@/types/connector';
import { searchPackages, fetchFiltersProgressively, SortOption } from '@/lib/rest-client';
import ConnectorCard from '@/components/ConnectorCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import WSO2Header from '@/components/WSO2Header';

// Valid sort options for validation
const VALID_SORT_OPTIONS: SortOption[] = [
  'name-asc',
  'name-desc',
  'pullCount-desc',
  'pullCount-asc',
  'date-desc',
  'date-asc',
];

// Default values
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 30;
const DEFAULT_SORT: SortOption = 'pullCount-desc';
const MAX_PAGE_SIZE = 100;

/**
 * Validate and parse page number from URL parameter
 */
function parsePageParam(value: string | null): number {
  if (!value) return DEFAULT_PAGE;
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 1) {
    return DEFAULT_PAGE;
  }
  return Math.floor(parsed);
}

/**
 * Validate and parse page size from URL parameter
 */
function parsePageSizeParam(value: string | null): number {
  if (!value) return DEFAULT_PAGE_SIZE;
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  // Clamp to sensible range
  return Math.min(Math.max(1, Math.floor(parsed)), MAX_PAGE_SIZE);
}

/**
 * Validate sort option from URL parameter
 */
function parseSortParam(value: string | null): SortOption {
  if (!value) return DEFAULT_SORT;
  if (VALID_SORT_OPTIONS.includes(value as SortOption)) {
    return value as SortOption;
  }
  return DEFAULT_SORT;
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode, systemMode } = useColorScheme();
  
  // Resolve the actual mode: if mode is 'system', use systemMode
  const resolvedMode = mode === 'system' ? systemMode : mode;

  const [connectors, setConnectors] = useState<BallerinaPackage[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    areas: [],
    vendors: [],
    types: [],
  });
  const [loading, setLoading] = useState(false); // For filter/pagination changes
  const [initialLoading, setInitialLoading] = useState(true); // For first page load
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    searchParams.get('areas')?.split(',').filter(Boolean) || []
  );
  const [selectedVendors, setSelectedVendors] = useState<string[]>(
    searchParams.get('vendors')?.split(',').filter(Boolean) || []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get('types')?.split(',').filter(Boolean) || []
  );
  const [currentPage, setCurrentPage] = useState(parsePageParam(searchParams.get('page')));
  const [pageSize, setPageSize] = useState(parsePageSizeParam(searchParams.get('size')));
  const [sortBy, setSortBy] = useState<SortOption>(parseSortParam(searchParams.get('sort')));

  // Refs to prevent effects from running on initial mount
  const isInitialMountRef = useRef(true);
  const initialFetchDoneRef = useRef(false);

  // Fetch page data from REST API
  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchPackages({
        query: searchQuery,
        areas: selectedAreas,
        vendors: selectedVendors,
        types: selectedTypes,
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort: sortBy,
      });

      setConnectors(response.packages);
      setTotalCount(response.count);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch page data:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load connectors. Please refresh the page or try again later.';
      setError(errorMessage);
      setLoading(false);
    }
  }, [searchQuery, selectedAreas, selectedVendors, selectedTypes, currentPage, pageSize, sortBy]);

  // Load filter options once on mount, then load first page
  useEffect(() => {
    const initialize = async () => {
      try {
        setInitialLoading(true);

        // Phase 1: Load first page immediately (fast)
        await fetchPageData();

        // Mark initial fetch as done to prevent duplicate fetch in the other effect
        initialFetchDoneRef.current = true;

        // Phase 2: Get filter options (cached or progressive)
        const filters = await fetchFiltersProgressively('ballerinax', (updatedFilters) => {
          // Background update when complete filters are fetched
          setFilterOptions(updatedFilters);
        });
        setFilterOptions(filters);

        setInitialLoading(false);
      } catch (error) {
        console.error('Failed to initialize:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load filters.';
        setError(errorMessage);
        setInitialLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger server-side fetch when filters/sort/page change (skip on initial load)
  useEffect(() => {
    // Skip if initial fetch hasn't been done yet or if we're still in initial loading
    if (!initialFetchDoneRef.current || initialLoading) {
      return;
    }
    fetchPageData();
  }, [initialLoading, fetchPageData]);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();

    // Only add non-default params to keep URL clean
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (pageSize !== 30) params.set('size', pageSize.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (selectedAreas.length > 0) params.set('areas', selectedAreas.join(','));
    if (selectedVendors.length > 0) params.set('vendors', selectedVendors.join(','));
    if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
    if (sortBy !== 'pullCount-desc') params.set('sort', sortBy);

    setSearchParams(params, { replace: true });
  }, [
    currentPage,
    pageSize,
    searchQuery,
    selectedAreas,
    selectedVendors,
    selectedTypes,
    sortBy,
    setSearchParams,
  ]);

  // Reset to page 1 when filters change (skip on initial mount to preserve URL page)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [selectedAreas, selectedVendors, selectedTypes, searchQuery, pageSize]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Filter handlers
  const handleAreaChange = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleVendorChange = (vendor: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendor) ? prev.filter((v) => v !== vendor) : [...prev, vendor]
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearAll = () => {
    setSelectedAreas([]);
    setSelectedVendors([]);
    setSelectedTypes([]);
    setSearchQuery('');
  };

  return (
    <>
      {/* WSO2 Header */}
      <WSO2Header />

      {/* Hero Section */}
      <Box
        key={`hero-${resolvedMode}`}
        sx={{
          borderBottom: 1,
          borderColor: resolvedMode === 'dark' ? '#27272A' : '#E5E7EB',
          background:
            resolvedMode === 'dark'
              ? 'linear-gradient(to right, #18181B, #18181B, rgba(255, 115, 0, 0.1))'
              : 'linear-gradient(to right, #F3F4F6, #FFFFFF, #FFF7ED)',
        }}
      >
        <Box
          sx={{
            maxWidth: '1440px',
            margin: '0 auto',
            px: { xs: 2, sm: 3 },
            py: { xs: 5, md: 5 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 3, md: 0 },
            }}
          >
            {/* Left side - Title and Description */}
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.875rem', sm: '2rem', md: '2.25rem' },
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: resolvedMode === 'dark' ? '#FFFFFF' : 'inherit',
                }}
              >
                Connector Store
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  color: resolvedMode === 'dark' ? '#A1A1AA' : '#52525B',
                  fontSize: '1rem',
                }}
              >
                Discover and integrate with 100+ pre-built connectors for enterprise platforms
              </Typography>
            </Box>

            {/* Right side - Feature Badges (hidden on mobile) */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 4,
                color: resolvedMode === 'dark' ? '#A1A1AA' : '#52525B',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Zap
                  color="#FF7300"
                  size={20}
                />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Fast Integration
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Shield
                  color="#FF7300"
                  size={20}
                />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Enterprise Ready
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Globe
                  color="#FF7300"
                  size={20}
                />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Global Support
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: '1440px',
          margin: '0 auto',
          px: { xs: 2, sm: 3 },
          py: 4,
        }}
      >

        {/* Initial Loading State */}
        {initialLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        )}

        {/* Main Content */}
        {!initialLoading && (
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Filter Sidebar - Always visible */}
            <Box sx={{ width: { xs: '100%', md: '280px' }, flexShrink: 0 }}>
              <FilterSidebar
                filterOptions={filterOptions}
                selectedAreas={selectedAreas}
                selectedVendors={selectedVendors}
                selectedTypes={selectedTypes}
                searchQuery={searchQuery}
                onAreaChange={handleAreaChange}
                onVendorChange={handleVendorChange}
                onTypeChange={handleTypeChange}
                onSearchChange={setSearchQuery}
                onClearAll={handleClearAll}
              />
            </Box>

            {/* Connector Grid */}
            <Box sx={{ flex: 1 }}>
              {/* Error State */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Top Controls Bar */}
              <Box
                sx={{
                  mb: 3,
                }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalCount}
                  pageSize={pageSize}
                  sortBy={sortBy}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  onSortChange={setSortBy}
                />
              </Box>

              {totalCount === 0 && !loading ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight={300}
                >
                  <Typography variant="h6" gutterBottom>
                    No connectors found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ position: 'relative' }}>
                  {/* Loading Overlay */}
                  {loading && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(0, 0, 0, 0.7)'
                            : 'rgba(255, 255, 255, 0.7)',
                        zIndex: 10,
                        minHeight: 300,
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                      },
                      gap: 3,
                      opacity: loading ? 0.5 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {connectors.map((connector) => (
                      <ConnectorCard
                        connector={connector}
                        key={`${connector.name}-${connector.version}`}
                      />
                    ))}
                  </Box>

                  {/* Pagination - Bottom */}
                  <Box sx={{ mt: 4 }}>
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalCount}
                      pageSize={pageSize}
                      sortBy={sortBy}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                      onSortChange={setSortBy}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
