import coreApi from "@/libs/axios/core";

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

  const response = await coreApi.get(`/event/map?${params.toString()}`);

  return response.data;
};

// =========================================================
// event loading functions
// =========================================================
export const loadEventFullData = async ({ dataId, userId }) => {
  const params = new URLSearchParams();

  if (userId) params.append("user_id", userId);

  const response = await coreApi.get(
    `/event/data/${dataId}?${params.toString()}`,
  );

  return response.data;
};
