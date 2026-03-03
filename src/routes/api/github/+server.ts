import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    try {
        const response = await fetch(
            'https://api.github.com/users/abrorilhuda/repos?sort=pushed&per_page=6&type=public',
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'abrorilhuda.me'
                }
            }
        );

        if (!response.ok) {
            return json({ error: 'Failed to fetch GitHub repos' }, { status: response.status });
        }

        const repos = await response.json();

        const simplified = repos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            pushed_at: repo.pushed_at,
            topics: repo.topics ?? []
        }));

        return json(simplified, {
            headers: {
                'Cache-Control': 'public, max-age=300' // cache 5 minutes
            }
        });
    } catch (err) {
        console.error('GitHub API error:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
