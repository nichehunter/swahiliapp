import authApi from "@/libs/axios/auth";

// =========================================================
// LOGIN
// =========================================================
export const loadDictionary = async (dictionaryId) => {
  const response = await authApi.get(
    `/gateway/dictionary?dictionary_id=${dictionaryId}`,
  );

  return response.data;
};

export const loadDictionaryParent = async (dictionaryId, parentId) => {
  const response = await authApi.get(
    `/gateway/dictionary/parent?dictionary_id=${dictionaryId}&parent_id=${parentId}`,
  );

  return response.data;
};
