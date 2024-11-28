Global Components:
Header

Contains navigation and user authentication status.
Footer

Displays general information and quick links.
NotificationBanner

Displays real-time alerts for updates, new proposals, and reminders.
Modal

Reusable for actions such as confirming event RSVPs or voting submissions.
Button

Reusable button component with different styles (primary, secondary).
FormElements

Inputs, text areas, dropdowns, checkboxes, etc.
LoadingSpinner

Indicates data loading processes.
CardComponent

For displaying information snippets like event details or proposal summaries.
Page-Specific Components:
WalletConnectComponent

Handles wallet integration via TON Connect 2.0.
AuthStatusIndicator

Displays connection status.
LoginButton

Initiates the wallet connection.
UserOverviewCard

Displays an overview of the user’s wallet, including balance and reputation score.
EventSummaryList

Lists upcoming events with brief details.
ProposalSummaryList

Lists active proposals for quick access.
EventDetailsCard

Displays event title, date, location, and a description.
RSVPButton

For users to confirm attendance (token-gated if necessary).
QRCodeDisplay

Shows a scannable QR code for event check-in.
EventRegistrationForm

Form for new event submissions (admin only).
AttendanceList

Displays attendees for event coordinators.
ProposalDetailsCard

Shows proposal title, description, voting period, and results.
VoteButton

For users to submit their vote.
ProposalCreationForm

For admins to create new proposals.
DiscussionThread

Embedded Telegram-style comment section for proposal discussions.
VotingResultsGraph

Visual representation of voting outcomes.
SearchBar

For finding specific members.
FilterDropdown

To filter members by city, expertise, or reputation.
MemberProfileCard

Displays member details, including badges and reputation.
ProfileOverview

Shows the user’s wallet address, balance, and reputation.
EventParticipationHistory

Displays a history of events attended.
GovernanceParticipationHistory

Lists proposals the user has participated in.
EditProfileForm

For users to update their display name or information (if allowed).
ProposalManagementList

Lists all proposals with options to edit or delete.
EventManagementList

Lists all events with edit/delete options.
CreateEventButton

Shortcut to the event registration form.
CreateProposalButton

Shortcut to the proposal creation form.
TreasuryOverviewCard

(optional) Shows fund allocation status.
Pages:
Login Page

Contains the wallet connection interface.
Dashboard Page

Displays user overview, event summary, proposal summary, and notifications.
Event Page

Displays event details, RSVP button, QR code, event registration form (admin only), and attendance list (admin only).
Governance Page

Displays proposal details, vote button, proposal creation form (admin only), discussion thread, and voting results graph.
Member Directory Page

Contains search bar, filter dropdown, and member profile cards.
User Profile Page

Displays profile overview, event participation history, governance participation history, and edit profile form.
Admin Dashboard Page

Displays proposal management list, event management list, create event button, create proposal button, and treasury overview card (optional).
Additional Notes:
Dependencies: Next.js, shadcn, Tailwind CSS, Telegram Bot API, TON SDK.
Known Limitations: The user experience may be influenced by the constraints of Telegram’s in-app browser.