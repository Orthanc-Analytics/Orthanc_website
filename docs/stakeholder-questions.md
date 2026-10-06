# Website interview guide

The best website copy answers the questions customers and investors actually ask. Use this guide to collect them from the people who talk to customers, then update the site (`src/i18n/en.json` and `it.json`, especially the Polis FAQ and the Investors page).

**How to run it.** 20–30 minutes per person, one person at a time. Record the exact words people use, not your summary. Interview at least: a founder, whoever runs demos or sales, an analyst who uses Orthanc Polis daily, and whoever handles investors.

## For people who talk to prospects (sales, demos, founders)

1. What are the first three questions a party or campaign asks in a first call?
2. Which question makes the conversation go well? Which one makes it stall?
3. What do prospects think Orthanc Polis does before they see it? What surprises them in the demo?
4. Which module do they ask to see first? Which one do they ignore?
5. What objections come up most often (price, data protection, AI, "we already have pollsters", internal politics)? How do you answer them today?
6. Who else in their organisation has to say yes? What does that person need to read?
7. Which competitors or alternatives do they mention, by name?
8. What would you like a prospect to have read on the website before your first call?

## For analysts and product people

1. Which three things in Orthanc Polis save the most time? How much time, roughly, and compared with what?
2. Which data source do users trust most? Which one do they question?
3. Where do users get confused (terms, labels, numbers)? Which words do they use instead of ours?
4. What do users ask for that isn't built yet?

## For whoever handles investors

1. What do investors ask first? What do they misunderstand about the market?
2. Which numbers do they want to see (users, pilots, revenue, pipeline, retention)? Which can we publish, with what context and date?
3. What is in the data room today? What is missing?
4. Which part of the story ("why us, why now") lands best?

## For everyone

1. If you could change one thing on the website, what would it be?
2. Which page or sentence would you be embarrassed to show a customer? Why?
3. What should we never say on the website?

## After the interviews

- Group the questions by theme and frequency.
- Update the **Polis FAQ** (`polis.faq.items`) with the top questions, in the customers' own words.
- Add verified traction to `src/content/traction.json` (each item needs context, date and source).
- Add team members to `src/content/team.json` with a "why us" line.
- Re-check every claim against the brand kit's "words to avoid" table.
