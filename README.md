# Emoji Quiz App

## Team Members

- MAgdalena Rios
- Yasmin Jama
- Anastasiia Skachenko
- Negar Baharmand
- Hugo Oblak

## About the Project

An interactive quiz application where users can test their knowledge by guessing movies, songs, or programming concepts from emojis, quotes, or lyrics.

## Features

- Multiple quiz categories (Movies, Music, Programming)
- Different quiz types (Emojis, Quotes, Lyrics, Easy, Hard)
- Timer tracking for each question
- Score calculation based on time and accuracy
- Progress tracking
- User data storage with Supabase

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Supabase (Database)
- LocalStorage (Timer data)

## Performance Evaluation

### Lighthouse Scores

![Lighthouse Results](images/lighthouse-results.png)

- Performance: 99/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

### Performance Optimizations

1. ✅ Added `defer` attribute to all script tags
2. ✅ Moved all scripts to bottom of HTML body
3. ✅ Added `loading="lazy"` to all images
4. ✅ Added meta viewport tag for mobile responsiveness
5. ✅ Added meta description for SEO

## SEO Implementation

### Technical SEO
1. ✅ **Meta Tags**
   - Viewport, description, language attribute

2. ✅ **Semantic HTML**
   - Proper HTML5 structure

3. ✅ **Image Optimization**
   - Alt text and lazy loading

4. ✅ **robots.txt**
   - Created robots.txt to guide search engine crawlers
   - Allows indexing of all pages

5. ✅ **Performance & Mobile**
   - Fast loading, responsive design

6. ✅ **Valid HTML**
   - 0 errors on W3C validator

## How to Run

1. Clone the repository
2. Open `index.html` in a browser
3. Or use a local server (e.g., Live Server extension in VS Code)

## Development

We use feature branches and pull requests for code reviews before merging to main.
