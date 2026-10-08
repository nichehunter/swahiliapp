import coreApi from "@/libs/axios/core";

// =========================================================
// view increment function
// =========================================================
export const postView = async (id) => {
  const response = await coreApi.post(
    `/engagement/entities/views/increment/${id}`,
  );

  return response.data;
};

// =========================================================
// like toggle function
// =========================================================
export const postLike = async (data) => {
  const response = await coreApi.post(`/engagement/likes/toggle`, data);

  return response.data;
};

// =========================================================
// bookmark toggle function
// =========================================================
export const postBookmark = async (data) => {
  const response = await coreApi.post(`/engagement/bookmarks/toggle`, data);

  return response.data;
};

// =========================================================
// review post function
// =========================================================
export const postReview = async (data) => {
  const response = await coreApi.post(
    `/engagement/entities/reviews/${data.entity}`,
    data,
  );

  return response.data;
};
