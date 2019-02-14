export default interface StreamBody {
    data: Array<StreamData>;
}

interface StreamData {
	id: number;
	user_id: number;
	user_name: string;
	game_id: number;
	community_ids: Array<number>;
	type: string;
	title: string;
	viewer_count: number;
	started_at: Date;
	language: string;
	thumbnail_url: string;
}