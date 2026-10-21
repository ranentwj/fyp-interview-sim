# Product Specification

## Document purpose

This document is the living source of truth for what this application should become. It should be reviewed before planning a milestone or making a change that affects product behaviour, architecture, or the user experience.

The document deliberately distinguishes between:

- **Confirmed** — agreed direction or requirement.
- **Proposed** — a recommendation that still needs approval.
- **Open** — a decision that has not yet been made.
- **Current implementation** — what happens to exist today; this is not automatically a permanent product requirement.

Last reviewed: 22 October 2026.

## Product identity

**Product name:** RGS — Requirements Gathering Simulator.

**Status: Confirmed**

## Product vision

**Status: Confirmed**

Build a modular requirements-gathering simulator in which a user conducts realistic interviews with virtual people from varied backgrounds. Virtual participants may differ in age, ethnicity, gender, occupation, location, experience, needs, and perspective.

The simulator should help a user practise discovering pain points, behaviours, needs, constraints, and requirements for improving products and services. For example, an HCI researcher could interview virtual users to investigate problems with a ticketing service such as Ticketmaster.

The system should begin with a carefully designed frontend and then grow incrementally into a functional text experience with scenarios, personas, conversation handling, assessment, speech, and an optional visual or avatar layer.

The application should remain understandable, intentionally designed, and maintainable. New capabilities should be added as coherent milestones rather than as one large implementation.

## Problem being addressed

**Status: Confirmed**

Learning to gather useful requirements requires practice with people who have different circumstances, experiences, behaviours, and priorities. Access to a sufficiently varied group of real participants can be difficult, time-consuming, and inconsistent.

RGS should provide a safe and repeatable environment in which users can practise questioning, active listening, follow-up, and the discovery of pain points and requirements. Virtual participants allow users to try different approaches, make mistakes, and eventually receive feedback without requiring a human participant for every practice session.

RGS is a training and simulation tool. It should not claim that a simulated participant can replace genuine research with the real people affected by a product or service.

## Intended users

**Status: Confirmed broadly; initial priority remains open**

RGS is intended for people learning or practising requirements gathering, including:

- HCI students and researchers.
- UX and user researchers.
- Requirements-engineering students and practitioners.
- Business analysts.
- Product and service designers.
- Other learners who need to interview users, customers, stakeholders, or research participants.

**Open:** Decide which of these groups the first version should prioritise. This does not exclude the others; it determines whose terminology, learning needs, and workflow should guide the earliest design decisions.

## Core user journey

**Status: Confirmed at a high level**

1. The user opens the Welcome page and selects **Begin**.
2. The user enters or chooses an interview topic and, where relevant, an interview objective.
3. The user continues to the interviewee roster.
4. The user either selects a prepared interviewee or opens a separate page to create a custom interviewee.
5. The user reviews the selected or generated interviewee before continuing.
6. The application introduces the topic, objective, and public persona information.
7. The user starts an interview session.
8. The user enters a question in the chat interface.
9. The frontend sends the question to the application's backend.
10. The backend combines the question with the scenario, persona instructions, conversation history, and relevant rules.
11. The backend sends the prepared request to a configured language-model provider.
12. The model generates the virtual participant's response.
13. The backend validates and returns the response.
14. The frontend displays the response in the conversation.
15. The user continues gathering requirements until the interview is completed.
16. The user ends the interview and continues to a completion or feedback page.
17. The system later assesses the completed interview and presents feedback grounded in the transcript.
18. Optional speech and avatar layers may present the same virtual-participant response through audio and animation.

## Simplified system flow

```text
User
   ↓
Frontend interview interface
   ↓
Application backend API
   ↓
Interview rules, scenario, persona, history, and safety handling
   ↓
Language-model provider
   ↓
Text response
   ↓
Frontend displays response
   ↓ optional
Text-to-speech provider
   ↓ optional
Avatar or visual presentation
```

## Product principles

### Incremental development

**Status: Confirmed**

Build and understand one coherent milestone at a time. Avoid implementing the complete system in a single step.

### Modular boundaries

**Status: Confirmed**

Keep clear internal boundaries between:

- Interface and presentation.
- API routes.
- Interview-session logic.
- Scenarios and personas.
- Chatbot providers.
- Safety handling.
- Assessment.
- Speech.
- Avatar or visual presentation.

### Replaceable external services

**Status: Confirmed**

External services should be accessed through provider interfaces so that a provider can be replaced without redesigning the rest of the application.

Examples include:

- Language-model providers.
- Text-to-speech providers.
- Persistence or database implementations.
- Avatar engines.

### One application initially

**Status: Confirmed**

Use one repository and one Next.js application initially. Frontend and backend are separate responsibilities inside that application, not separate repositories or separately deployed systems.

The architecture should preserve the option to extract a backend service later if that becomes justified.

### Secure server boundary

**Status: Confirmed**

API keys, private persona instructions, safety rules, assessment prompts, and direct database access must remain on the server. The browser must not call a paid language-model service directly with a secret key.

### Accessible, responsive interface

**Status: Confirmed**

The interface should work on desktop and smaller screens, support keyboard use, provide clear focus states, communicate loading and errors accessibly, and respect reduced-motion preferences.

### Light and dark themes

**Status: Confirmed**

The application should support light, dark, and system theme preferences. Shared semantic design tokens should be used so components do not implement separate, duplicated colour systems.

### Diverse representation without stereotyping

**Status: Confirmed**

The simulator should support virtual participants with varied ages, ethnicities, genders, occupations, locations, backgrounds, and experiences.

Demographic attributes should contribute to realistic context without being used as shortcuts for personality, behaviour, ability, preferences, or needs. Personas should be intentionally written and should avoid reductive or harmful stereotypes.

## Frontend responsibilities

**Status: Confirmed**

The frontend is responsible for:

- Displaying scenarios and public persona information.
- Displaying the current conversation.
- Collecting user input.
- Sending requests to the backend.
- Showing loading, error, and session states.
- Displaying assessment feedback.
- Providing speech controls when speech is added.
- Displaying avatar states when an avatar is added.

The frontend is not responsible for:

- Holding API secrets.
- Calling the language-model provider directly.
- Storing authoritative private persona instructions.
- Making authoritative safety or assessment decisions.
- Directly accessing a database.

## Backend responsibilities

**Status: Confirmed**

The backend is responsible for:

- Validating requests from the frontend.
- Loading the selected scenario and persona.
- Managing interview-session state.
- Storing or retrieving conversation history.
- Applying safety and relevance rules.
- Preparing requests for the language model.
- Calling configured external providers.
- Validating and returning provider responses.
- Completing interviews and generating assessments.
- Protecting secrets and private instructions.

## API boundary

**Status: Confirmed conceptually; exact routes are proposed**

The frontend communicates with the backend through application-owned API routes. The backend then communicates with external providers through their APIs.

These are separate communications triggered by one user action:

```text
Frontend → application API → external provider API
```

Proposed long-term application routes:

```text
POST /api/interviews
GET  /api/interviews/[sessionId]
POST /api/interviews/[sessionId]/messages
POST /api/interviews/[sessionId]/complete
```

**Open:** Approve the session-based API design before it is implemented.

## Interview sessions

**Status: Proposed**

An interview session should eventually contain:

- A unique session ID.
- The selected scenario ID.
- The selected persona ID or persona configuration.
- Conversation messages.
- Session status, such as active or completed.
- Start and completion times.
- Safety decisions where relevant.
- Assessment results after completion.

The frontend should not be the permanent authoritative store for a session. During early development, an in-memory server repository may be used before introducing persistent database storage.

## Scenarios

**Status: Confirmed conceptually**

A scenario describes the requirements-gathering context and the user's objective.

Public scenario information may include:

- Title.
- Category.
- Expected duration.
- Brief.
- Requirements-gathering objective.

Private scenario information may include:

- Facts the virtual participant knows.
- Facts that should only be revealed after suitable questions.
- Hidden motivations or constraints.
- Behaviour rules.
- Boundaries and refusal behaviour.
- Assessment criteria.

Private information must remain server-side.

## Personas

**Status: Confirmed conceptually**

A persona defines the virtual participant's identity and behaviour within a scenario.

Public persona information may include:

- Name.
- Age.
- Ethnicity or cultural background.
- Gender.
- Occupation.
- Location, where relevant.
- Short background.
- Public role in the scenario.
- Visible traits, where appropriate.
- Avatar or initials.

Private persona information may include:

- Personality.
- Detailed history or background information that should be discovered through questioning.
- Priorities and frustrations.
- Communication style.
- Knowledge boundaries.
- Information-disclosure rules.
- Emotional or conversational tendencies.

Persona behaviour should be separate from safety and assessment logic.

**Open:** Decide the remaining private persona fields when persona behaviour is designed. Personality is confirmed as private rather than being fully exposed to the user before the interview.

## Conversation handling

**Status: Confirmed at a high level**

The language model should eventually receive sufficient structured context to respond consistently, including:

- The scenario.
- The persona instructions.
- Relevant conversation history.
- The user's latest message.
- Safety or relevance decisions.
- Session state where relevant.

The provider should return a text response through a shared provider contract. The interface should not know which model or provider generated it.

## Safety and relevance handling

**Status: Confirmed as a required future capability**

The system should suitably handle:

- Irrelevant questions.
- Inappropriate questions.
- Unsafe content.
- Attempts to make the virtual participant ignore its role.
- Questions outside the persona's knowledge.

Safety handling should remain a distinct architectural responsibility rather than being inseparably mixed with persona generation.

**Open:** Define the exact categories, behaviours, escalation rules, and expected responses.

## Assessment and feedback

**Status: Confirmed as a required future capability**

Assessment should occur after or during an interview without changing the virtual participant's role into that of an assessor.

Potential assessment areas include:

- Use of open questions.
- Avoidance of leading questions.
- Quality of follow-up questions.
- Empathy and rapport.
- Depth of exploration.
- Premature solution suggestions.
- Coverage of the interview objective.
- Use of evidence from the conversation.

Feedback should be grounded in the transcript and, where useful, cite examples from the user's questions.

The full interview transcript should eventually be downloadable. A Word document (`.docx`) is the preferred initial export format, subject to a later technical decision about the document-generation library and layout.

**Open:** Define the assessment rubric, scoring approach, timing, and presentation.

## Speech

**Status: Confirmed as a later capability**

Text remains the canonical virtual-participant response. A text-to-speech provider may convert that text into audio.

The text interview should continue to work when:

- Speech is disabled.
- A speech request fails.
- A speech provider is replaced.
- The user prefers text only.

**Open:** Select a provider, voice controls, playback behaviour, and accessibility requirements.

## Avatar and visual layer

**Status: Confirmed as a later capability**

The avatar layer should be independent enough to work with different chatbot and speech providers.

Potential generic avatar states include:

- Idle.
- Listening.
- Thinking.
- Speaking.

The avatar may later consume audio, timing data, visemes, or emotion hints, but it should not own interview logic or call the language model directly.

**Open:** Decide whether the intended result is a real-time animated avatar, generated video, or another visual presentation.

## User-interface direction

**Status: Partly confirmed, partly open**

Confirmed:

- A text-chat interview workspace.
- Scenario and public persona information visible during an interview.
- Clear conversation history.
- A message composer with keyboard support.
- Loading, error, and reset behaviour.
- Independent scrolling for long conversations and supporting information.
- Light, dark, and system themes.
- Responsive behaviour.
- A linear pre-interview journey: Welcome, Topic, Interviewee, interviewee review, and Interview.
- A roster-first interviewee experience with custom interviewee creation on a separate page.
- A confirmation before abandoning, restarting, or ending an active interview.
- A restart action for an active interview.
- The selected topic and objective displayed below the interviewee information in the interview workspace.

Open:

- Final brand and visual identity.
- Detailed topic-page fields and prepared-topic behaviour.
- Detailed visual design of the completion and feedback page.
- Assessment-screen design.
- Mobile presentation of persona information.
- Speech and avatar controls.

## Frontend page and journey requirements

**Status: Confirmed unless marked otherwise**

### Proposed routes

The following route structure is the accepted direction. Dynamic session behaviour will be implemented in a later milestone.

```text
/                                      Welcome page
/setup/topic                           Topic and objective
/setup/interviewee                     Prepared interviewee roster
/setup/interviewee/create              Custom interviewee creation and review
/interview/[sessionId]                 Interview workspace
/interview/[sessionId]/feedback        Completion, transcript, and future assessment
```

### Welcome page

- Display the product name and a short explanation of what RGS helps the user practise.
- Use one clear primary action labelled **Begin**.
- Make the **Begin** action span the width of the introductory text block.
- Give the words **Requirements Gathering Simulator** greater visual prominence than a small label or eyebrow.
- Do not include login, account, saved-history, or returning-user actions in the initial frontend. Every visit is treated as a fresh start.
- Do not add a separate "fresh session" helper line to the Welcome page.
- A visual preview may show the idea of interviewing a virtual participant, but it must not imply that the avatar feature already works.

**Initial visual direction: Confirmed**

Use the chat-preview concept for the first frontend: introductory copy and the primary action are paired with a compact example interview conversation. This accurately communicates the initial text-based experience without implying that speech or avatar capabilities already exist.

Retain the avatar-led Welcome concept as a possible later evolution after the avatar milestone. Retain the three-step Welcome concept as a possible alternative once the Topic experience and overall setup journey are mature enough to describe accurately.

Initial copy, which may be revised later:

```text
Welcome to RGS
Practise better requirements gathering.
Interview realistic virtual participants, uncover needs and pain points, and build confidence before conducting real research.
```

### Topic page

- Appear immediately after the Welcome page and before interviewee selection.
- Begin as a lightweight placeholder form while the topic model is refined.
- Include a topic or service field, an optional context field, and a likely interview-objective field.
- Place a clear **Next** button at the bottom of the form.
- Preserve the option to add prepared topic choices later without redesigning the whole journey.

The initial placeholder form and these three fields are confirmed. The final topic data model may still refine their labels, required status, or relationship.

**Open:** Confirm whether the interview objective is always part of the topic, optional, or a separate concept.

### Interviewee roster page

- Make the prepared roster the dominant content of the page.
- Use the same prepared roster for every topic in the initial version.
- Provide a prominent **Create your own** action that opens the separate custom-interviewee page.
- Show each prepared interviewee as a portrait card with at least name and age visible.
- On hover or keyboard focus, reveal a short background through a gradual frosted overlay that becomes more opaque toward the text area. Essential information must not depend on hover alone.
- Selecting a card opens a detail dialog with the full public persona information.
- The detail dialog provides **Continue** and **Back** or close actions. Opening a card does not immediately begin the interview.

### Custom interviewee page

- Keep custom creation separate from the roster so the roster remains easy to browse and the form can grow without crowding one page.
- Collect the agreed public attributes and any later-approved generation inputs.
- Show a loading state while generation occurs once backend generation exists.
- Show a review step before the generated interviewee can be used.
- Allow the user to go back and revise or regenerate before continuing.

**Open:** Decide the custom personality controls and which generated details are editable.

### Interview workspace

- Use text chat as the default mode until speech and avatar capabilities exist.
- On desktop, reserve approximately one third of the workspace for public interviewee information, with the selected topic and objective below it, and two thirds for the active interview.
- Later support three presentation modes: full avatar, split avatar and transcript, and full text with a picture-in-picture avatar.
- Once the avatar capability exists, avatar mode may become the default.
- The later full-avatar mode may place a compact question composer and the latest two or three messages over the video. Speech is planned before avatar, so the overlay is a convenience and fallback rather than the only input method.
- A closed picture-in-picture avatar can be restored with a visible maximise action.
- Provide a clearly labelled **End interview** action. It opens a confirmation before completion.
- Provide a restart action with confirmation. Restarting discards the current transcript and starts the interview again with the same setup.
- Confirm before the user navigates away from an active interview and would lose progress.
- Do not include a pause control during the text-only milestone. Reconsider pause when live microphone, audio playback, or timed sessions are introduced.
- Sent messages should not be editable in the initial version. Editing an earlier message would invalidate the later conversation and require those later responses to be removed and regenerated or preserved as a separate branch.

### Completion and feedback page

- Before assessment is implemented, provide a simple end state rather than abruptly returning the user to another page.
- Initially offer **Choose another interviewee**, **Start over**, and **Review transcript** actions.
- Later expand this page to show the transcript, downloadable transcript, assessed parameters, evidence-based feedback, and results.

### Navigation direction

**Status: Confirmed for the initial frontend**

Use a lightweight application header and a setup progress indicator rather than a full navigation menu. The header initially contains the RGS name or logo and the light/dark/system theme control. Setup pages may also show a compact **Topic → Interviewee → Interview** progress indicator. The initial journey is short and linear, and there are no accounts, history, or unrelated destinations that justify a large menu. Use contextual **Back** and **Next** actions during setup, then focused interview controls in the workspace. Reconsider a fuller navigation system if saved sessions, account settings, learning modules, or history are added.

The progress indicator is not shown on the Welcome page. It appears on the setup pages, highlights the current step, and is replaced by focused interview controls once the interview begins.

### First frontend implementation slice

**Status: Implemented on 22 October 2026**

The first implementation slice contains only:

- The shared page frame and lightweight header.
- The Welcome page.
- The placeholder Topic page.
- Navigation between those two pages.
- Existing light, dark, and system theme support.
- A desktop layout built on responsive foundations.

This slice is complete when:

- `/` displays the Welcome page.
- **Begin** opens `/setup/topic`.
- The Topic page contains the three agreed fields.
- **Next** remains unavailable until a topic is entered.
- Back navigation preserves the entered values.
- Theme selection works on both pages.
- Keyboard controls and visible focus states work correctly.

The interviewee roster, custom interviewee creation, persona dialogs, interview workspace, backend, and language-model connection are deliberately excluded from this slice.

## Naming conventions

**Status: Proposed for approval**

Names should describe permanent responsibility rather than development stage.

React components use PascalCase:

```text
InterviewWorkspace.tsx
MessageList.tsx
MessageComposer.tsx
PersonaSummary.tsx
```

Logic and server files use lowercase kebab-case:

```text
start-interview-session.ts
send-interview-message.ts
complete-interview-session.ts
chat-provider.ts
scenario-repository.ts
```

Replaceable implementations explicitly identify themselves:

```text
mock-chat-provider.ts
openai-chat-provider.ts
in-memory-session-repository.ts
database-session-repository.ts
```

Temporary test data uses the fixture suffix and lives under testing:

```text
src/testing/fixtures/interview.fixture.ts
```

Avoid stage-based names in permanent application code, including:

```text
Demo
Final
Real
New
Temporary
```

**Open:** Decide whether code-level component names should use neutral domain names such as `InterviewWorkspace` or product-prefixed names such as `RgsInterviewWorkspace`. Neutral names are currently recommended because they are shorter and already clear within this repository; RGS remains the displayed product name.

## Separation of temporary and production code

**Status: Confirmed direction**

Temporary implementations must be clearly identifiable and replaceable. Permanent interface and application-service code must not directly depend on testing fixtures.

Mocks should be retained for local development and automated testing, even after production providers are introduced. They should be selected through configuration or dependency construction rather than hard-coded throughout the application.

## Reference-project policy

**Status: Confirmed**

The separately attached interview-training repository is reference material only.

When considering a concept from it:

1. Explain the underlying idea and its relevance.
2. Prefer a clean implementation designed for this application's architecture.
3. Reuse code directly only when it is self-contained, compatible, legally appropriate, and clearly better than rewriting it.
4. Adapt useful concepts to shared interfaces and conventions in this application.
5. Avoid unnecessary dependencies and duplicated systems.
6. Record what was inspired by or adapted from the reference project.

No large sections should be copied wholesale.

## Development sequence

**Status: Confirmed at a high level**

### Milestone 0 — Architecture and naming cleanup

- Agree on this product specification.
- Rename permanent interface files to permanent names.
- Isolate mocks and fixtures.
- Establish clear scenario, session, and provider boundaries.
- Keep visible behaviour substantially unchanged.
- Document the architecture.

### Milestone 1 — Pure frontend application

**Immediate development priority**

- Define the pages and screens that make up the application.
- Define the pre-interview journey and navigation between pages.
- Decide what each page displays and which actions are available.
- Design the placement of buttons, text boxes, scenario information, persona information, and navigation controls.
- Establish the visual direction, including colours, typography, spacing, and reusable interface patterns.
- Establish the desktop layout and responsive foundations; defer detailed mobile design.
- Represent important interface states such as empty, selected, active, loading, error, and completed states.
- Build reusable application components with permanent responsibility-based names.
- Use replaceable placeholder content where backend data will eventually appear.
- Do not connect a real language model during this milestone.

### Milestone 2 — Functional text requirements-gathering interview

- Start an interview session.
- Submit user messages through the application API.
- Generate responses using a real language-model provider.
- Preserve a mock provider for development and testing.
- Handle loading, errors, cancellation, and reset behaviour.

### Milestone 3 — Scenarios, personas, state, and safety

- Support structured scenarios and personas.
- Maintain conversation and interview-session state.
- Handle irrelevant, inappropriate, unsafe, and out-of-role questions.
- Preserve private scenario and persona instructions on the server.

### Milestone 4 — Assessment and feedback

- Complete an interview.
- Assess the transcript against an agreed rubric.
- Produce evidence-based feedback.
- Display the assessment clearly.

### Milestone 5 — Text-to-speech

- Convert virtual-participant text responses into audio.
- Add playback controls and failure handling.
- Keep text as the canonical response.

### Milestone 6 — Independent avatar layer

- Add generic avatar states.
- Synchronise speaking behaviour with audio where possible.
- Keep the avatar independent of the selected chatbot provider.

## Planning required before the pure-frontend milestone

**Status: Proposed checklist for review**

The following frontend decisions should be discussed before implementing additional pages or components:

### Page inventory

- Which pages or major screens should exist?
- Which page should users see first?
- Is scenario selection a page, a modal, or part of a dashboard?
- Is persona selection separate from scenario selection?
- Is assessment shown on a dedicated page?

### Pre-interview journey

- What happens between opening RGS and beginning an interview?
- Does the user receive instructions or onboarding?
- Does the user select a scenario, participant, difficulty, or learning objective?
- What information is shown before the interview begins?

### Navigation

- What persistent navigation should the application have?
- Can the user return to a previous step without losing selections?
- How does the user leave, restart, or abandon an interview?

### Interview workspace

- Which scenario details should remain visible during the interview?
- Which public persona details should remain visible?
- Where should the conversation, composer, controls, and future avatar appear?
- How should the user end the interview?
- What should happen if the user attempts to leave midway?

### Visual direction

- What visual tone should RGS have?
- Does the current colour palette remain suitable?
- What branding, logo, typography, spacing, and component style should be used?
- What should differ between light and dark themes?

### Responsive behaviour

**Decision:** Detailed mobile design is deferred until after the initial desktop-focused frontend is established.

The initial frontend should still use responsive foundations so that mobile support can be added without rebuilding the application. This means avoiding unnecessary fixed widths, keeping components separable, allowing layouts to wrap or stack, and ensuring that important information is not structurally tied to one desktop arrangement.

During the later mobile-design work, decide:

- How navigation changes on smaller screens.
- How scenario and persona information remains accessible on mobile.
- Which controls collapse, move, or become menus.
- Which mobile screen sizes and devices are officially supported.

### Interface states

An interface state is a different condition in which the same page or component may appear. These should be considered while designing each page rather than planned as a separate activity.

Examples include:

- **Empty:** No scenario, participant, or conversation has been selected yet.
- **Selected:** The user has selected an option but has not continued.
- **Active:** An interview is currently in progress.
- **Loading:** The application is waiting for data or a response.
- **Error:** Something failed and the user needs an explanation or recovery action.
- **Disabled:** An action is temporarily unavailable, such as sending an empty message.
- **Completed:** The interview has ended and the next action is available.

Only states relevant to a particular page need to be designed. They will be identified while working through the page inventory, journey, navigation, workspace, and visual direction.

### Frontend acceptance criteria

The completion criteria for the pure-frontend milestone will be defined while planning the pages, user journey, navigation, interview workspace, and visual direction. They do not need to be decided as a separate preliminary task.

At minimum, the final criteria should state which pages, interactions, desktop screen sizes, keyboard behaviours, and accessibility behaviours must work before the milestone is considered complete.

Only decisions that materially affect the immediate frontend should block this milestone. Backend-provider, database, assessment, speech, avatar, and deployment decisions may remain open until their corresponding milestones.

## Current implementation

**Status: Informational — not all current choices are permanent**

The repository currently contains:

- A Welcome page at `/` using the selected chat-preview direction.
- A placeholder Topic page at `/setup/topic` with topic, objective, and context fields.
- A shared application frame with RGS identity and light, dark, and system theme controls.
- A reusable setup-progress component, currently shown on the Topic page.
- Temporary in-browser setup state that preserves Topic form values during client-side Back and Begin navigation.
- A Next.js application with one interview workspace prototype.
- A responsive text-chat interface.
- One hard-coded scenario and persona.
- Light, dark, and system themes.
- Independent conversation and supporting-information scrolling.
- A mock keyword-response provider.
- An application API route for requesting a response.
- Shared request and response types.
- Basic request validation, loading, cancellation, reset, and error handling.

Current limitations include:

- No real language-model connection.
- No use of an API key.
- No persistent interview sessions.
- No database.
- No multiple-scenario selection.
- No implemented safety module.
- No assessment.
- No speech.
- No avatar.
- No automated test suite.

The current mock-server milestone is uncommitted and should be reconsidered as part of the architecture and naming cleanup before it is committed.

The immediate product focus is the pure frontend. Existing mock-server work should not be treated as the final backend design merely because it currently exists in the working tree.

## Technical constraints and preferences

**Status: Confirmed unless marked otherwise**

- Use TypeScript.
- Use Next.js as the initial full-stack framework.
- Keep one repository and application initially.
- Use clear frontend and backend boundaries.
- Keep provider-specific logic behind interfaces.
- Keep secrets in ignored environment files such as `.env.local`.
- Do not commit API keys.
- Prefer small, understandable dependencies.
- Avoid duplicated systems.
- Prefer application-specific reusable components over forcing an incompatible component library into the design.
- Keep commits separated by coherent feature or change where practical.
- Verify changes with linting, type checking, and proportionate functional testing.

## Out of scope for the immediate milestone

**Status: Confirmed**

During the architecture cleanup and pure-frontend milestone, do not add:

- A real language-model provider.
- API-key configuration.
- Database persistence.
- Authentication.
- Assessment logic.
- Speech.
- Avatar or video generation.
- Additional scenarios merely to demonstrate variety.

Temporary local content and state may be used to build and demonstrate the frontend, provided that they are clearly isolated and replaceable.

## Decisions confirmed during review

- RGS stands for Requirements Gathering Simulator.
- The product focuses on practising requirements gathering with varied virtual participants.
- Intended contexts include HCI research, UX research, requirements engineering, business analysis, and product or service design.
- The first frontend should remain general rather than committing to one final specialised scenario.
- Public persona information may include name, age, ethnicity or cultural background, gender, occupation, location, a short background, and relevant public role information.
- Personality should remain private rather than being fully revealed before the interview.
- The immediate development focus is a pure-frontend milestone.
- The main frontend steps are agreed; their detailed page layouts and component states remain to be designed.
- The accepted frontend order is Welcome, Topic, Interviewee, interviewee review, and Interview.
- The topic page appears immediately after the Welcome page.
- The prepared interviewee roster is the same for every initial topic.
- Custom interviewee creation uses a separate page and includes a review step.
- Prepared interviewee cards open a detail dialog before the user continues.
- There is no login or returning-user path in the initial application; all users begin a fresh journey.
- Text is the initial interview mode; speech precedes avatar development, and avatar may later become the default presentation mode.
- Active interviews provide end and restart actions with confirmation, and leaving an active interview requires confirmation.
- A later completion and feedback page will contain transcript review, downloadable transcript, results, and assessed parameters.
- Detailed mobile design is deferred, but new frontend components should remain responsive-ready.
- Interface states and frontend completion criteria will be addressed while planning the initial pages and user journey.

## Open decisions

The following decisions should be resolved before or during the relevant milestone:

- [ ] Which user group should the first version prioritise when terminology or workflow differs: HCI students, novice UX researchers, requirements-engineering learners, practitioners, or another group?
- [ ] Should code use the recommended neutral domain names such as `InterviewWorkspace`, or product-prefixed names such as `RgsInterviewWorkspace`?
- [ ] After the general frontend is established, what should the first fully implemented requirements-gathering scenario be?
- [ ] Beyond personality, what persona information should remain private and be discovered through questioning?
- [ ] Should sessions initially be stored in memory, local files, or a database?
- [ ] Which language-model provider and model should be used first?
- [ ] How should provider selection be configured?
- [ ] What safety categories and behaviours are required?
- [ ] What assessment rubric should be used?
- [ ] Should assessment happen only at the end or also during the interview?
- [ ] Which text-to-speech provider should be used?
- [ ] Is the visual goal an animated avatar, generated video, or something else?
- [ ] Will users need accounts and saved interview history after the initial fresh-session-only application?
- [ ] Where will the application eventually be deployed?

## Change record

Record major product decisions here or move them into dedicated decision records if this section becomes too large.

### 21 October 2026

- Created the initial product specification from the existing project discussion and repository state.
- Marked uncertain assumptions as proposed or open rather than treating them as confirmed requirements.
- Established that architecture and naming should be reviewed before adding further capabilities.
- Confirmed that RGS means Requirements Gathering Simulator.
- Refocused the vision, problem, and intended users on requirements gathering with diverse virtual participants.
- Defined the initial public persona information and confirmed that personality remains private.
- Added an intentionally undefined pre-interview stage to the user journey for later frontend design.
- Added a pure-frontend milestone as the immediate development priority and renumbered later milestones.
- Added a frontend-planning checklist and incorporated the user's saved open-decision notes into the relevant sections.
- Confirmed the pre-interview order: Welcome, Topic, Interviewee, review, and Interview.
- Chose a roster-first interviewee page with a separate custom-interviewee creation page.
- Defined the initial page requirements, proposed routes, interview controls, and completion flow.
- Deferred pause controls and sent-message editing, and recorded future Word transcript export.

### 22 October 2026

- Confirmed the initial Topic-page placeholder fields.
- Confirmed the initial completion-page actions.
- Refined the Welcome-page direction: a wider Begin action, more prominent product description, and no fresh-session helper line.
- Confirmed the lightweight application header with RGS identity, theme control, and contextual setup progress instead of a large navigation menu.
- Confirmed the exact progress-indicator behaviour and the scope and completion criteria of the first frontend implementation slice.
- Selected the chat-preview Welcome design for the initial frontend; retained the avatar-led and three-step concepts as later design options.
- Implemented the first frontend slice: shared frame, Welcome page, Topic page, navigation, setup progress, retained form values, themes, and responsive foundations.

