# Projects Feature

Management and display of portfolio projects.

## Overview

The projects feature provides a structured way to showcase various development projects, experiments, and client work. It uses a combination of static metadata and internationalized content.

## Implementation Details

- **Directory**: `apps/web/src/entities/project`
- **Data Model**: `Project` interface in `model/types.ts`.
- **Configuration**: `PROJECT_METADATA` in `config/projects.ts` contains the static configuration (tags, links, colors).
- **UI Components**: `ProjectCard` for consistent project presentation.

## Data Flow

1.  **Metadata**: Static project info (ids, tags, links) is defined in `config/projects.ts`.
2.  **Translations**: Project titles and descriptions are fetched from JSON message files using `next-intl`.
3.  **Mapping**: The `ProjectsPage` maps the static metadata to the translated content using the project `id`.

## Schema

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique identifier used for translation mapping |
| `title` | string | Translated title |
| `description` | string | Translated description |
| `tags` | string[] | List of technologies used |
| `link` | string | External link (GitHub, Live demo, etc.) |
| `color` | string | Background gradient classes for the card |
