const axios = require('axios');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

class BlogUpdater {
    constructor() {
        this.parser = new Parser();
        this.blogs = [];
        this.sources = [
            {
                name: 'GitHub Blog',
                url: 'https://github.blog/feed/',
                type: 'rss',
                category: 'Tech Insights',
                priority: 1
            },
            {
                name: 'Dev.to',
                url: 'https://dev.to/feed',
                type: 'rss',
                category: 'Web Dev',
                priority: 2
            },
            {
                name: 'CSS-Tricks',
                url: 'https://css-tricks.com/feed/',
                type: 'rss',
                category: 'Web Dev',
                priority: 2
            },
            {
                name: 'JavaScript Weekly',
                url: 'https://javascriptweekly.com/rss/',
                type: 'rss',
                category: 'JavaScript',
                priority: 3
            },
            {
                name: 'Smashing Magazine',
                url: 'https://www.smashingmagazine.com/feed/',
                type: 'rss',
                category: 'Web Dev',
                priority: 2
            },
            {
                name: 'A List Apart',
                url: 'https://alistapart.com/main/feed/',
                type: 'rss',
                category: 'Web Dev',
                priority: 2
            }
        ];
    }

    async fetchRSSFeed(source) {
        try {
            console.log(`🔄 Fetching from ${source.name}...`);
            const feed = await this.parser.parseURL(source.url);
            console.log(`✅ Fetched ${feed.items.length} items from ${source.name}`);
            
            return feed.items.slice(0, 4).map(item => ({
                title: this.cleanTitle(item.title),
                description: this.cleanDescription(item.contentSnippet || item.description),
                url: item.link,
                date: new Date(item.pubDate || item.isoDate),
                category: source.category,
                source: source.name,
                tags: this.extractTags(item.categories || [], source.category),
                readTime: this.calculateReadTime(item.contentSnippet || item.description),
                priority: source.priority
            }));
        } catch (error) {
            console.error(`❌ Error fetching from ${source.name}:`, error.message);
            return [];
        }
    }

    async fetchGitHubTrending() {
        try {
            console.log('🔄 Fetching GitHub trending repositories...');
            const response = await axios.get('https://api.github.com/search/repositories', {
                params: {
                    q: 'stars:>1000 pushed:>2024-01-01 language:javascript OR language:python OR language:typescript OR language:go',
                    sort: 'stars',
                    order: 'desc',
                    per_page: 6
                },
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-Blog-Updater'
                }
            });

            console.log(`✅ Found ${response.data.items.length} trending repositories`);
            
            return response.data.items.map(repo => ({
                title: `🔥 Trending: ${repo.name}`,
                description: this.cleanDescription(repo.description) || 'Explore this trending repository that\'s making waves in the developer community.',
                url: repo.html_url,
                date: new Date(repo.updated_at),
                category: 'Open Source',
                source: 'GitHub Trending',
                tags: [repo.language, 'trending', 'open-source'].filter(Boolean),
                readTime: '3 min read',
                priority: 2
            }));
        } catch (error) {
            console.error('❌ Error fetching GitHub trending:', error.message);
            return [];
        }
    }

    async fetchTechNews() {
        try {
            console.log('🔄 Fetching tech news...');
            const techSources = [
                'https://feeds.feedburner.com/oreilly/radar',
                'https://rss.cnn.com/rss/edition.rss'
            ];

            const promises = techSources.map(async (url) => {
                try {
                    const feed = await this.parser.parseURL(url);
                    return feed.items.slice(0, 3).map(item => ({
                        title: this.cleanTitle(item.title),
                        description: this.cleanDescription(item.contentSnippet || item.description),
                        url: item.link,
                        date: new Date(item.pubDate || item.isoDate),
                        category: 'Tech News',
                        source: feed.title || 'Tech News',
                        tags: this.extractTags(item.categories || [], 'Tech News'),
                        readTime: this.calculateReadTime(item.contentSnippet || item.description),
                        priority: 3
                    }));
                } catch {
                    return [];
                }
            });

            const results = await Promise.all(promises);
            const techNews = results.flat();
            console.log(`✅ Fetched ${techNews.length} tech news articles`);
            return techNews;
        } catch (error) {
            console.error('❌ Error fetching tech news:', error.message);
            return [];
        }
    }

    async fetchAIMLContent() {
        try {
            console.log('🔄 Fetching AI/ML content...');
            const response = await axios.get('https://api.github.com/search/repositories', {
                params: {
                    q: 'topic:artificial-intelligence OR topic:machine-learning OR topic:deep-learning stars:>500 pushed:>2024-06-01',
                    sort: 'updated',
                    order: 'desc',
                    per_page: 5
                },
                headers: {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-Blog-Updater'
                }
            });

            console.log(`✅ Found ${response.data.items.length} AI/ML repositories`);
            
            return response.data.items.map(repo => ({
                title: `🤖 AI/ML: ${repo.name}`,
                description: this.cleanDescription(repo.description) || 'Discover cutting-edge AI/ML projects and innovations.',
                url: repo.html_url,
                date: new Date(repo.updated_at),
                category: 'AI/ML',
                source: 'GitHub AI/ML',
                tags: ['ai', 'machine-learning', repo.language].filter(Boolean),
                readTime: '4 min read',
                priority: 1
            }));
        } catch (error) {
            console.error('❌ Error fetching AI/ML content:', error.message);
            return [];
        }
    }

    cleanTitle(title) {
        if (!title) return "Interesting Tech Article";
        return title.replace(/(<([^>]+)>)/gi, "")
                   .replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .trim()
                   .substring(0, 80);
    }

    cleanDescription(description) {
        if (!description) return "Click to read more about this interesting tech topic...";
        return description.replace(/(<([^>]+)>)/gi, "")
                         .replace(/&amp;/g, '&')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&quot;/g, '"')
                         .replace(/\s+/g, ' ')
                         .trim()
                         .substring(0, 150) + "...";
    }

    extractTags(categories, fallbackCategory) {
        let tags = [];
        
        if (Array.isArray(categories)) {
            tags = categories;
        } else if (typeof categories === 'string') {
            tags = [categories];
        }
        
        // Add fallback tags based on category
        const categoryTags = {
            'Web Dev': ['webdev', 'javascript', 'css'],
            'AI/ML': ['ai', 'machinelearning', 'python'],
            'Tech News': ['technology', 'news', 'innovation'],
            'Open Source': ['opensource', 'github', 'development']
        };
        
        if (categoryTags[fallbackCategory]) {
            tags = tags.concat(categoryTags[fallbackCategory]);
        }
        
        return tags.slice(0, 3)
                  .map(tag => tag ? tag.toLowerCase().replace(/[^a-z0-9]/g, '') : '')
                  .filter(Boolean)
                  .slice(0, 3);
    }

    // Helper function to get appropriate image for blog post
    getPostImage(title, category, tags) {
        const lowerTitle = title.toLowerCase();
        const lowerTags = tags.map(tag => tag.toLowerCase()).join(' ');
        
        // AI/ML related
        if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('neural') || lowerTags.includes('ai')) {
            return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Security related
        if (lowerTitle.includes('security') || lowerTitle.includes('vulnerability') || lowerTitle.includes('cve') || lowerTags.includes('security')) {
            return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // React/Frontend
        if (lowerTitle.includes('react') || lowerTitle.includes('frontend') || lowerTitle.includes('javascript') || lowerTags.includes('react')) {
            return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // CSS/Design
        if (lowerTitle.includes('css') || lowerTitle.includes('design') || lowerTitle.includes('ui') || lowerTags.includes('css')) {
            return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Python/Backend
        if (lowerTitle.includes('python') || lowerTitle.includes('backend') || lowerTitle.includes('api') || lowerTags.includes('python')) {
            return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // DevOps/Cloud
        if (lowerTitle.includes('docker') || lowerTitle.includes('cloud') || lowerTitle.includes('deploy') || lowerTags.includes('devops')) {
            return 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Git/Version Control
        if (lowerTitle.includes('git') || lowerTitle.includes('github') || lowerTitle.includes('version') || lowerTags.includes('git')) {
            return 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Web Development general
        if (category === 'Web Dev' || lowerTitle.includes('web') || lowerTitle.includes('development') || lowerTags.includes('webdev')) {
            return 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Tech Insights/General
        if (category === 'Tech Insights') {
            return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Default fallback
        return 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&h=200&fit=crop&crop=center&auto=format&q=80';
    }

    calculateReadTime(content) {
        if (!content) return '3 min read';
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / 200);
        return `${Math.max(1, minutes)} min read`;
    }

    async updateBlogSection() {
        try {
            console.log('🚀 Starting blog update process...');
            console.log('📅 Current date:', new Date().toISOString());

            // Fetch from all sources in parallel
            const [rssBlogs, githubTrending, techNews, aimlContent] = await Promise.all([
                Promise.all(this.sources.map(source => this.fetchRSSFeed(source))),
                this.fetchGitHubTrending(),
                this.fetchTechNews(),
                this.fetchAIMLContent()
            ]);

            // Combine and flatten all blogs
            this.blogs = [
                ...rssBlogs.flat(),
                ...githubTrending,
                ...techNews,
                ...aimlContent
            ];

            // Filter out invalid entries and sort
            this.blogs = this.blogs
                .filter(blog => blog && blog.title && blog.url && blog.date)
                .sort((a, b) => {
                    // Sort by priority first, then by date
                    if (a.priority !== b.priority) {
                        return a.priority - b.priority;
                    }
                    return new Date(b.date) - new Date(a.date);
                })
                .slice(0, 18); // Limit to 18 posts

            console.log(`📚 Total blogs collected: ${this.blogs.length}`);
            console.log(`📊 Categories: ${[...new Set(this.blogs.map(b => b.category))].join(', ')}`);

            // Update the HTML file
            await this.updateHTMLFile();
            
            // Create a JSON file for easy access
            await this.createBlogJSON();

            console.log('✅ Blog update completed successfully!');
            console.log('🎉 Your portfolio now has fresh content!');
            
        } catch (error) {
            console.error('❌ Blog update failed:', error);
            process.exit(1);
        }
    }

    async updateHTMLFile() {
        try {
            const indexPath = path.join(process.cwd(), 'index.html');
            
            if (!fs.existsSync(indexPath)) {
                console.error('❌ index.html not found!');
                return;
            }

            let html = fs.readFileSync(indexPath, 'utf8');
            console.log('📄 Reading HTML file...');

            // Generate blog cards HTML
            const blogCards = this.blogs.map((blog, index) => {
                const date = new Date(blog.date);
                const day = format(date, 'd');
                const month = format(date, 'MMM');
                
                const categorySlug = blog.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const imageUrl = this.getPostImage(blog.title, blog.category, blog.tags);
                
                return `
                <article class="blog-post" data-category="${categorySlug}">
                    <div class="blog-post-image">
                        <img src="${imageUrl}" alt="${blog.title}" loading="lazy">
                        <div class="blog-post-date">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                        </div>
                    </div>
                    <div class="blog-post-content">
                        <div class="blog-post-meta">
                            <span class="category">${blog.category}</span>
                            <span class="read-time">${blog.readTime}</span>
                        </div>
                        <h3>${blog.title}</h3>
                        <p>${blog.description}</p>
                        <div class="blog-post-footer">
                            <div class="blog-tags">
                                ${blog.tags.map(tag => `<span>#${tag}</span>`).join('')}
                            </div>
                            <a href="${blog.url}" target="_blank" class="read-more">
                                Read More <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </article>`;
            }).join('');

            // Replace the blog grid content
            const blogGridRegex = /(<div class="blog-grid">)([\s\S]*?)(<\/div>\s*<div class="blog-cta">)/;
            
            if (blogGridRegex.test(html)) {
                html = html.replace(blogGridRegex, `$1${blogCards}
                $3`);
                console.log('✅ Blog grid updated successfully');
            } else {
                console.log('⚠️ Blog grid pattern not found, trying alternative method...');
                // Alternative method - look for blog-grid class
                const altRegex = /(<div class="blog-grid">)([\s\S]*?)(<\/div>[\s\S]*?<div class="blog-cta">)/;
                if (altRegex.test(html)) {
                    html = html.replace(altRegex, `$1${blogCards}
                $3`);
                    console.log('✅ Blog grid updated with alternative method');
                }
            }

            // Add or update the last updated comment
            const lastUpdated = format(new Date(), 'PPpp');
            const lastUpdatedComment = `<!-- Last updated: ${lastUpdated} -->`;
            
            if (html.includes('<!-- Last updated:')) {
                html = html.replace(/<!-- Last updated: .* -->/, lastUpdatedComment);
            } else {
                html = html.replace('<div class="blog-grid">', `${lastUpdatedComment}\n                <div class="blog-grid">`);
            }

            // Write the updated HTML
            fs.writeFileSync(indexPath, html);
            console.log('📝 HTML file updated with new blog content');
            
        } catch (error) {
            console.error('❌ Error updating HTML file:', error);
            throw error;
        }
    }

    async createBlogJSON() {
        try {
            const blogData = {
                lastUpdated: new Date().toISOString(),
                totalPosts: this.blogs.length,
                categories: [...new Set(this.blogs.map(blog => blog.category))],
                sources: [...new Set(this.blogs.map(blog => blog.source))],
                posts: this.blogs.map(blog => ({
                    ...blog,
                    date: blog.date.toISOString()
                }))
            };

            const jsonPath = path.join(process.cwd(), 'blog-data.json');
            fs.writeFileSync(jsonPath, JSON.stringify(blogData, null, 2));
            console.log('📄 Blog JSON data file created');
            
        } catch (error) {
            console.error('❌ Error creating blog JSON:', error);
            throw error;
        }
    }
}

// Run the blog updater
console.log('🎯 Starting Portfolio Blog Updater...');
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
console.log('📂 Working directory:', process.cwd());

const updater = new BlogUpdater();
updater.updateBlogSection()
    .then(() => {
        console.log('🎉 Blog update process completed!');
        console.log('✨ Your portfolio is now updated with fresh content!');
    })
    .catch((error) => {
        console.error('💥 Blog update failed:', error);
        process.exit(1);
    });
