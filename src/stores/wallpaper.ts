import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { WallpaperApi } from "../config/api/wallpaper";
import type { Wallpaper, WallpaperQuery } from "../config/api/types";

export const useWallpaperStore = defineStore("wallpaper", () => {
	// 状态
	const wallpapers = ref<Wallpaper[]>([]);
	const currentWallpaper = ref<Wallpaper | null>(null);
	const categories = ref<any[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const currentQuery = ref<WallpaperQuery>({
		page: 1,
		pageSize: 20,
		sortBy: "latest",
	});
	const total = ref(0);
	const hasMore = ref(true);

	// 计算属性
	const hasError = computed(() => error.value !== null);
	const isEmpty = computed(() => wallpapers.value.length === 0);
	const totalPages = computed(() =>
		Math.ceil(total.value / currentQuery.value.pageSize)
	);

	// 操作
	const setLoading = (state: boolean) => {
		loading.value = state;
	};

	const setError = (message: string | null) => {
		error.value = message;
	};

	const clearError = () => {
		error.value = null;
	};

	// 获取壁纸列表
	const fetchWallpapers = async (
		query?: Partial<WallpaperQuery>,
		reset = false
	) => {
		try {
			setLoading(true);
			clearError();

			const params = { ...currentQuery.value, ...query };
			const response = await WallpaperApi.getWallpapers(params);

			if (reset || params.page === 1) {
				wallpapers.value = response.list;
			} else {
				wallpapers.value.push(...response.list);
			}

			total.value = response.total;
			hasMore.value = response.page < response.totalPages;
			currentQuery.value = params;
		} catch (err) {
			const message = err instanceof Error ? err.message : "获取壁纸失败";
			setError(message);
			console.error("Failed to fetch wallpapers:", err);
		} finally {
			setLoading(false);
		}
	};

	// 加载更多
	const loadMore = async () => {
		if (!hasMore.value || loading.value) return;

		await fetchWallpapers({
			page: currentQuery.value.page + 1,
		});
	};

	// 获取壁纸详情
	const fetchWallpaperDetail = async (id: string) => {
		try {
			setLoading(true);
			clearError();

			const wallpaper = await WallpaperApi.getWallpaper(id);
			currentWallpaper.value = wallpaper;

			// 同时更新列表中的数据
			const index = wallpapers.value.findIndex((w) => w.id === id);
			if (index > -1) {
				wallpapers.value[index] = wallpaper;
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "获取壁纸详情失败";
			setError(message);
			console.error("Failed to fetch wallpaper detail:", err);
		} finally {
			setLoading(false);
		}
	};

	// 获取分类
	const fetchCategories = async () => {
		try {
			categories.value = await WallpaperApi.getCategories();
		} catch (err) {
			console.error("Failed to fetch categories:", err);
		}
	};

	// 搜索壁纸
	const searchWallpapers = async (
		keyword: string,
		options?: Partial<WallpaperQuery>
	) => {
		try {
			setLoading(true);
			clearError();

			const params = {
				page: 1,
				pageSize: 20,
				...options,
			};

			const response = await WallpaperApi.searchWallpapers(keyword, params);

			wallpapers.value = response.list;
			total.value = response.total;
			hasMore.value = response.page < response.totalPages;
			currentQuery.value = { ...params, keyword };
		} catch (err) {
			const message = err instanceof Error ? err.message : "搜索失败";
			setError(message);
			console.error("Failed to search wallpapers:", err);
		} finally {
			setLoading(false);
		}
	};

	// 点赞壁纸
	const likeWallpaper = async (id: string) => {
		try {
			const result = await WallpaperApi.likeWallpaper(id);

			// 更新本地状态
			const updateWallpaper = (wallpaper: Wallpaper) => {
				if (wallpaper.id === id) {
					wallpaper.likes = result.likes;
				}
			};

			wallpapers.value.forEach(updateWallpaper);
			if (currentWallpaper.value?.id === id) {
				currentWallpaper.value.likes = result.likes;
			}
		} catch (err) {
			console.error("Failed to like wallpaper:", err);
			throw err;
		}
	};

	// 下载壁纸
	const downloadWallpaper = async (id: string) => {
		try {
			const result = await WallpaperApi.downloadWallpaper(id);

			// 更新下载次数
			const updateWallpaper = (wallpaper: Wallpaper) => {
				if (wallpaper.id === id) {
					wallpaper.downloads = result.downloads;
				}
			};

			wallpapers.value.forEach(updateWallpaper);
			if (currentWallpaper.value?.id === id) {
				currentWallpaper.value.downloads = result.downloads;
			}

			return result.downloadUrl;
		} catch (err) {
			console.error("Failed to download wallpaper:", err);
			throw err;
		}
	};

	// 重置状态
	const reset = () => {
		wallpapers.value = [];
		currentWallpaper.value = null;
		total.value = 0;
		hasMore.value = true;
		clearError();
		currentQuery.value = {
			page: 1,
			pageSize: 20,
			sortBy: "latest",
		};
	};

	return {
		// 状态
		wallpapers,
		currentWallpaper,
		categories,
		loading,
		error,
		currentQuery,
		total,
		hasMore,

		// 计算属性
		hasError,
		isEmpty,
		totalPages,

		// 操作
		setLoading,
		setError,
		clearError,
		fetchWallpapers,
		loadMore,
		fetchWallpaperDetail,
		fetchCategories,
		searchWallpapers,
		likeWallpaper,
		downloadWallpaper,
		reset,
	};
});
