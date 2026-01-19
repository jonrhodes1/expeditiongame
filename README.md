# The Expedition Game: The North Pole

An interactive interprofessional workshop exercise simulating critical decision-making on a North Pole expedition inspired by Preet Chandi's expeditions.

## Live Demo

🔗 **[Play the game here](https://[your-username].github.io/[repository-name]/)**

Replace `[your-username]` and `[repository-name]` with your actual GitHub username and repository name.

## About

This educational game is designed for a 40-minute interprofessional workshop session. Students play as members of a support team guiding an expedition through six critical scenarios, managing three resource pools:
- **Safety**: Physical wellbeing and injury prevention
- **Time**: Progress within a fixed extraction window
- **Focus**: Concentration and psychological resilience

## Features

- ✅ Six realistic expedition scenarios with hidden scoring
- ✅ Fixed 70-day timeline (Day 11 to Day 70)
- ✅ Resource pool management (14 points per domain)
- ✅ Decision diversity mechanics (prevents middle-only strategies)
- ✅ Special weightings for critical safety decisions
- ✅ Downloadable expedition report and SOP document
- ✅ Full results breakdown with lessons learned
- ✅ Professional Royal Geographical Society-inspired design

## GitHub Pages Deployment

### Quick Setup

1. **Create a new repository** on GitHub
   - Go to https://github.com/new
   - Name it (e.g., `expedition-game`)
   - Make it Public
   - Don't initialize with README (you already have these files)

2. **Push your files to GitHub**
   ```bash
   cd /Users/jrhodes/Desktop/Expeditiongame
   git init
   git add .
   git commit -m "Initial commit: North Pole Expedition Game"
   git branch -M main
   git remote add origin https://github.com/[your-username]/[repository-name].git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages** (in the left sidebar)
   - Under "Source", select **Deploy from a branch**
   - Under "Branch", select **main** and **/ (root)**
   - Click **Save**

4. **Access your game**
   - Wait 1-2 minutes for deployment
   - Visit: `https://[your-username].github.io/[repository-name]/`
   - Your game will be live!

### Files Included

- `index.html` - Main application structure
- `app.js` - Game logic and scenario data
- `styles.css` - Royal Geographical Society-inspired styling
- `jspdf.umd.min.js` - PDF generation library (local, no CDN)
- `northpole0.png` - Background image (optional)
- `northpole1.png` - Background image (optional)

All files use **relative paths** and will work correctly on GitHub Pages.

## Local Development

To run locally:

1. Open `index.html` in a web browser, or
2. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`

No build process or dependencies required!

## Technical Details

- **Framework**: Vanilla JavaScript (no dependencies)
- **Styling**: Pure CSS with animations
- **PDF Export**: Client-side generation (jsPDF)
- **Compatibility**: All modern browsers
- **Mobile**: Responsive design

## Game Mechanics

### Resource Pools
- Start with 14 points in Safety, Time, and Focus
- Each decision costs hidden points (revealed at end)
- Critical threshold: 5 points
- Win condition: All pools ≥ 5 at Day 70

### Decision Diversity
- Must use at least one Option A (quick action)
- Must use at least one Option C (full intervention)
- Choosing only Option B results in -2 penalty to all pools

### Special Weightings
- **Scenario 2 Option A**: Focus cost = 5 (navigation with impaired vision)
- **Scenario 4 Option A**: Safety cost = 5 (hypothermia risk)
- **Late expedition penalty**: After Day 35, stopping (Time rating 0) adds +1 Focus cost

### Timeline
- Fixed schedule across 6 scenarios
- Day 11 → 22 → 33 → 44 → 56 → 67 → 70
- Time pressure feedback (not affecting days)

## Educational Goals

- Interprofessional collaboration and decision-making
- Risk assessment and escalation management
- Resource management under constraint
- Best practice application in extreme environments
- Development of actionable SOPs and risk assessments

## Credits

**Developed by:**
- Dr Jonathon Rhodes
- Dr Alastair Smith

**Organization:**
[Plymouth Exploration and Discovery Research Unit](https://www.plymouth.ac.uk/research/pedru)

**Inspired by:**
Preet Chandi's polar expeditions

## License

This educational tool is provided for workshop and training use. Please credit the authors when using or adapting.

## Support

For questions or issues with the game, please open an issue in this repository.

---

**Version**: 1.0  
**Last Updated**: January 2026
