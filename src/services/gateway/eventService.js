import gatewayApi from "@/libs/axios/gateway";

// =========================================================
// event loading functions
// =========================================================
export const loadEventMap = async ({
  limit,
  offset,
  zoom,
  bbox,
  categoryId,
  subcategoryId,
  search,
} = {}) => {
  const params = new URLSearchParams();

  if (limit) params.append("limit", limit);
  if (offset) params.append("offset", offset);
  if (bbox !== null && bbox !== undefined) {
    params.append("in_bbox", bbox);
  }
  if (zoom !== null && zoom !== undefined) {
    params.append("zoom", zoom);
  }
  if (categoryId) params.append("category_id", categoryId);
  if (subcategoryId) params.append("sub_category_id", subcategoryId);
  if (search) params.append("search", search);

  const response = await gatewayApi.get(`/event/map?${params.toString()}`);

  return response.data;
};

export const loadNavigationEventMap = async ({
  limit,
  offset,
  bookmarked_only,
  user_id,
  is_featured,
  is_trending,
  entity_ids,
  search,
} = {}) => {
  const params = new URLSearchParams();

  if (limit) params.append("limit", limit);
  if (offset) params.append("offset", offset);
  if (bookmarked_only !== null && bookmarked_only !== undefined) {
    params.append("bookmarked_only", bookmarked_only);
  }
  if (user_id) params.append("user_id", user_id);
  if (is_featured !== null && is_featured !== undefined) {
    params.append("is_featured", is_featured);
  }
  if (is_trending !== null && is_trending !== undefined) {
    params.append("is_trending", is_trending);
  }
  if (entity_ids) params.append("entity_ids", entity_ids);
  if (search) params.append("search", search);

  const response = await gatewayApi.get(
    `/event/map/navigation?${params.toString()}`,
  );

  return response.data;
};

// =========================================================
// event loading functions
// =========================================================
export const loadEventFullData = async ({ dataId, userId }) => {
  const params = new URLSearchParams();

  if (userId) params.append("user_id", userId);

  const response = await gatewayApi.get(
    `/event/data/${dataId}?${params.toString()}`,
  );

  return response.data;
};

export const loadEventShared = async ({ dataId, userId }) => {
  const params = new URLSearchParams();

  if (userId) params.append("user_id", userId);

  const response = await gatewayApi.get(
    `/event/data/${dataId}?${params.toString()}`,
  );

  return response.data;
};
