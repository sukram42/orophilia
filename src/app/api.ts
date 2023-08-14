import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { View } from '../definitions/View';
import { configuration } from '../config/configuration';
import { File } from '../definitions/File';
import { HierarchicalMetaDataValue } from '../definitions/HierarchicalMetaDataValue';


export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Views', 'Files', 'HierarchicalFieldValues'],
  baseQuery: fetchBaseQuery({
    baseUrl: configuration.backendUrl,
  }),
  endpoints: (build) => ({
    getViews: build.query<{ [k:string]:View }, void>({
      query: () => 'views',
      providesTags: [{ type: 'Views', id: 'LIST' }],
    }),
    getViewById: build.query<View, string>({
      query: (id)=>`views/${id}`,
      providesTags: (result, error, id) => [{ type: 'Views', id }],
    }),
    updateView: build.mutation<View, { id: string; data: Partial<View> }>({
      query: ({ id, data })=>({
        url: `views/${id}`,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getViewById', id, (draft)=>{
            Object.assign(draft, patch.data);
          }),
        );
        try {
          await queryFulfilled;
        } catch (e) {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, id) => {
        return id
          ? [{ type: 'Views', id: id.id }, { type: 'Views', id: 'LIST' }] : [];
      },
    }),
    deleteView: build.mutation<View, { id: string }>({
      query: ({ id })=>({
        url: `views/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getViews', undefined, (draft)=>{
            delete draft[id];
          }),
        );
        try {
          await queryFulfilled;
        } catch (e) {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, id) => {
        return id
          ? [{ type: 'Views', id: id.id }, { type: 'Views', id: 'LIST' }] : [];
      },
    }),
    createNewView: build.mutation<View, void >({
      query: () => ({
        url: 'views',
        method: 'POST',
        body: {
          name: 'New View',
          metaFieldsIds:['filepath', 'filename', 'type', 'size'],
          properties: {},
          type: 'table',
        },
      }),
      invalidatesTags: () =>  [ { type: 'Views', id: 'LIST' }],
    }),

    // We should not be able to delete or create/register files
    getFiles: build.query<{ [k:string]: File }, { query: string, from: number, size: number }>({
      query: ({ query, from, size })=>({
        url: `files?_from=${from}&_size=${size}&${query}`,
        method: 'GET',
      }),
      providesTags: (result, error, args)=> [{ type: 'Files', id: `List_${args.from}_${args.size}_${args.query}` }],
    }),

    getStructure: build.query< { [k:string]: HierarchicalMetaDataValue }, { fieldName: string; prefix: string; level: number } >({
      query: ({ fieldName, prefix, level })=>({
        url: `structure/${ fieldName }`,
        method: 'GET',
        params: { prefix, level },
      }) }),

    // GetHierarchicalFieldValues
    getHierarchicalFieldValues: build.query<{ [k:string]: HierarchicalMetaDataValue }, { fieldName: string; depth: number }>({
      query: ({ fieldName, depth })=>({
        url: `hierarchical-field-values/${fieldName}?depth=${depth || -1}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'HierarchicalFieldValues', id: 'LIST' }],
    }),
  }),
});
export const {
  // View - related Hooks
  useGetViewsQuery, useGetViewByIdQuery,
  useUpdateViewMutation, useDeleteViewMutation, useCreateNewViewMutation,
  // Files - related Hooks
  useGetFilesQuery,

  //getStructure
  useGetStructureQuery,
  useGetHierarchicalFieldValuesQuery,
} = api;


