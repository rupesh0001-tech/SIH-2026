I want you to redesign ONLY the existing "Find Mandi" page to closely match the attached reference image.

REFERENCE IMAGE:
Use the attached image as the primary visual reference for the Find Mandi page layout, spacing, hierarchy, styling, cards, filters, and map section.

IMPORTANT — DO NOT DISTURB OTHER COMPONENTS:
- Do NOT modify the Dashboard page.
- Do NOT modify the Bookings page.
- Do NOT modify the Settings page.
- Do NOT modify authentication/login/register.
- Do NOT modify the existing sidebar component unless absolutely required for the Find Mandi active state.
- Do NOT modify the global layout/header unnecessarily.
- Do NOT change existing backend APIs, database schemas, authentication, routing, or unrelated functionality.
- Do NOT break existing components or functionality.
- Reuse existing components, styles, utilities, icons, and design tokens wherever possible.
- Changes should be isolated to the Find Mandi page and its directly related components.
- Before making changes, inspect the existing codebase and understand how the current Find Mandi page is implemented.

GOAL:
Transform the current Find Mandi page into a modern mandi discovery interface similar to the reference.

PAGE STRUCTURE:

1. PAGE HEADER
Keep the existing application header/branding structure, but make the Find Mandi content feel clean and modern.

Title:
"Find Mandi"

Subtitle:
"Compare live crop rates and open arrival slots across nearby yards."

2. SEARCH + FILTER SECTION
Add a prominent search/filter area near the top of the page.

Include:

- Search input:
  Placeholder: "Search mandi by name, district or location..."
  Include a search icon.

- State filter
  Example: Maharashtra

- District filter
  Example: All Districts

- Crop filter
  Example: All Crops

- Market Rate filter
  Allow minimum/maximum rate selection.

- Sorting filter
  Example: Nearest First

- Search button

The filter section should look like a clean horizontal toolbar/card with rounded borders, subtle shadows, and proper spacing.

Make the filters functional using the existing mandi data/state where possible.
Do not create unnecessary backend changes just for the UI.

3. MAIN CONTENT LAYOUT

Use a two-column layout:

LEFT:
Mandi listings

RIGHT:
Interactive map

The map should occupy roughly 35–40% of the available content width.

The listing section should occupy roughly 60–65%.

4. MANDI LISTINGS

Heading:
"Mandi Listings"

Show the number of results, for example:
"Mandi Listings (12 found)"

Subtitle:
"Live crop rates, open slots and real-time info"

Add List View / Map View controls if appropriate.

Display mandi cards in a clean grid/list layout matching the reference.

Each mandi card should contain:

- Mandi name
- Location/distance
- Crop
- Market rate
- Open slots today
- Slot availability status
- Relevant badge such as:
  "Fastest Clearance"
  "Highest Bidder"
  "Zero Gate Line"
  "Reliable Yard"
- "Book Unloading Slot" button

Use the existing mandi data if it already exists in the project.

Do NOT replace working functionality with hardcoded mock functionality unless the existing page has no data source.

5. MAP SECTION

Add a map panel on the RIGHT side.

Use OpenStreetMap for the map.

Prefer an existing map library already installed in the project if one exists.

If a map library is not installed, use the lightest appropriate implementation rather than introducing unnecessary dependencies.

The map should:

- Show mandi locations using markers.
- Show the user's/current location if that functionality already exists.
- Allow zooming.
- Allow panning.
- Have a clean rounded container.
- Have a header:
  "Mandi Locations"
  "View all mandis on map"
- Include an "Open in OpenStreetMap" action if practical.
- Selecting/clicking a mandi marker should correspond to the mandi listing where possible.
- Selecting a mandi from the list should highlight/focus its map marker where practical.

Do NOT use a fake static map image if an actual OpenStreetMap integration can be implemented.

6. VISUAL DESIGN

Match the reference image's visual language:

- White/light background
- Dark green primary text
- Green accent color
- Light green active states
- Rounded cards
- Thin subtle borders
- Soft shadows
- Clean modern typography
- Generous spacing
- Compact but readable information hierarchy
- Professional agricultural/government-tech SaaS appearance

Do not blindly copy every pixel.
Use the reference as the design direction while adapting it to the existing application's architecture and responsive behavior.

7. RESPONSIVENESS

Desktop:
- Two-column layout with listings + map.

Tablet:
- Reduce card width and spacing appropriately.

Mobile:
- Stack the listings and map vertically.
- Make filters horizontally scrollable or stack them cleanly.
- Do not cause horizontal overflow.

8. FUNCTIONALITY

Preserve all existing Find Mandi functionality.

The following should work:

- Search mandis
- Filter by state/district/crop
- Sort results
- Display mandi information
- View mandi locations
- Interact with map
- Book unloading slot

If some functionality already exists, extend it rather than rewriting it.

9. CODE QUALITY

Before editing:
- Inspect the existing Find Mandi page.
- Identify its components.
- Identify existing data/API/hooks.
- Identify existing styling system.
- Identify whether a map library already exists.

Then make the smallest clean set of changes required.

Do NOT rewrite the entire application.

Do NOT create duplicate components when existing reusable components can be extended.

Do NOT modify unrelated files.

After implementation:
- Run the project/build/type checker.
- Fix any errors caused by your changes.
- Verify that other routes/pages still work.
- Verify the Find Mandi page visually against the reference image.

MOST IMPORTANT CONSTRAINT:

THIS IS A PAGE-SPECIFIC UI REDESIGN.

Only modify the Find Mandi page and components directly required for it.

Everything else in the application must remain unchanged.