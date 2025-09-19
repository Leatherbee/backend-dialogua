# Dialogua Roleplay Features - Complete Integration Guide

This comprehensive guide covers testing roleplay features and integrating them into your Swift client application.

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Testing Roleplay Features](#testing-roleplay-features)
4. [Data Models](#data-models)
5. [Swift Integration](#swift-integration)
6. [Complete Implementation Examples](#complete-implementation-examples)
7. [UI Components](#ui-components)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

## Overview

The Dialogua roleplay system allows learners to practice conversational Indonesian through interactive scenarios. Each roleplay consists of:

- **Scenario**: Context and setting for the conversation
- **Character**: AI character the user interacts with
- **Turns**: Ordered conversation exchanges between user and character
- **Instructions**: Guidance for the learner's role

## API Endpoints

### Base URL
```
http://localhost:9000
```

### Roleplay Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/roleplay?contentItemId={id}` | GET | Get roleplay by content item ID | `contentItemId`: Content item ID |
| `/roleplay/{id}` | GET | Get specific roleplay by ID | `id`: Roleplay ID |
| `/roleplay-turn?roleplayId={id}` | GET | Get all turns for a roleplay | `roleplayId`: Roleplay ID |

## Testing Roleplay Features

### 1. Test Roleplay Data Retrieval

```bash
# Get roleplay by content item ID
curl -X GET "http://localhost:9000/roleplay?contentItemId=4" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "scenario": "Mahasiswa internasional baru tiba di bandara Indonesia, bertemu petugas bandara dan memperkenalkan diri.",
    "instructions": "Berperan sebagai mahasiswa internasional yang baru tiba di Indonesia. Jawab pertanyaan petugas dengan sopan dan jelas.",
    "character_name": "Petugas Bandara",
    "character_description": "Petugas bandara yang ramah dan membantu mahasiswa internasional",
    "content_item_id": 4,
    "metadata": {},
    "createdAt": "2025-09-19T09:16:18.708Z",
    "updatedAt": "2025-09-19T09:16:18.708Z",
    "deletedAt": null,
    "turns": [
      {
        "id": 8,
        "speaker": "character",
        "message": "Selamat pagi. Selamat datang di Indonesia.",
        "turn_order": 1,
        "roleplay_id": 1,
        "metadata": {},
        "createdAt": "2025-09-19T09:16:18.708Z",
        "updatedAt": "2025-09-19T09:16:18.708Z",
        "deletedAt": null
      },
      {
        "id": 7,
        "speaker": "user",
        "message": "Selamat pagi, Bu.",
        "turn_order": 2,
        "roleplay_id": 1,
        "metadata": {},
        "createdAt": "2025-09-19T09:16:18.708Z",
        "updatedAt": "2025-09-19T09:16:18.708Z",
        "deletedAt": null
      }
    ]
  }
]
```

### 2. Test Roleplay Turns

```bash
# Get turns for a specific roleplay
curl -X GET "http://localhost:9000/roleplay-turn?roleplayId=1" \
  -H "Content-Type: application/json"
```

### 3. Test Individual Roleplay

```bash
# Get specific roleplay by ID
curl -X GET "http://localhost:9000/roleplay/1" \
  -H "Content-Type: application/json"
```

## Data Models

### Swift Data Models for Roleplay

```swift
import Foundation

// MARK: - Roleplay
struct Roleplay: Codable, Identifiable {
    let id: Int
    let scenario: String
    let instructions: String
    let characterName: String
    let characterDescription: String
    let contentItemId: Int
    let metadata: [String: Any]?
    let createdAt: String
    let updatedAt: String
    let deletedAt: String?
    let turns: [RoleplayTurn]?
    
    enum CodingKeys: String, CodingKey {
        case id, scenario, instructions, metadata, createdAt, updatedAt, deletedAt, turns
        case characterName = "character_name"
        case characterDescription = "character_description"
        case contentItemId = "content_item_id"
    }
}

// MARK: - Roleplay Turn
struct RoleplayTurn: Codable, Identifiable {
    let id: Int
    let speaker: Speaker
    let message: String
    let turnOrder: Int
    let roleplayId: Int
    let metadata: [String: Any]?
    let createdAt: String
    let updatedAt: String
    let deletedAt: String?
    let roleplay: Roleplay?
    
    enum Speaker: String, Codable, CaseIterable {
        case user = "user"
        case character = "character"
    }
    
    enum CodingKeys: String, CodingKey {
        case id, speaker, message, metadata, createdAt, updatedAt, deletedAt, roleplay
        case turnOrder = "turn_order"
        case roleplayId = "roleplay_id"
    }
}

// MARK: - Roleplay Session (for tracking user progress)
struct RoleplaySession: Codable, Identifiable {
    let id: UUID
    let roleplayId: Int
    let currentTurnIndex: Int
    let userResponses: [String]
    let isCompleted: Bool
    let startedAt: Date
    let completedAt: Date?
    
    init(roleplayId: Int) {
        self.id = UUID()
        self.roleplayId = roleplayId
        self.currentTurnIndex = 0
        self.userResponses = []
        self.isCompleted = false
        self.startedAt = Date()
        self.completedAt = nil
    }
}
```

## Swift Integration

### API Service Extension for Roleplay

```swift
import Foundation
import Combine

extension DialoguaAPIService {
    
    // MARK: - Fetch Roleplay by Content Item
    func fetchRoleplay(contentItemId: Int) -> AnyPublisher<[Roleplay], Error> {
        guard let url = URL(string: "\(baseURL)/roleplay?contentItemId=\(contentItemId)") else {
            return Fail(error: URLError(.badURL))
                .eraseToAnyPublisher()
        }
        
        return session.dataTaskPublisher(for: url)
            .map(\.data)
            .decode(type: [Roleplay].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Fetch Specific Roleplay
    func fetchRoleplay(id: Int) -> AnyPublisher<Roleplay, Error> {
        guard let url = URL(string: "\(baseURL)/roleplay/\(id)") else {
            return Fail(error: URLError(.badURL))
                .eraseToAnyPublisher()
        }
        
        return session.dataTaskPublisher(for: url)
            .map(\.data)
            .decode(type: Roleplay.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Fetch Roleplay Turns
    func fetchRoleplayTurns(roleplayId: Int) -> AnyPublisher<[RoleplayTurn], Error> {
        guard let url = URL(string: "\(baseURL)/roleplay-turn?roleplayId=\(roleplayId)") else {
            return Fail(error: URLError(.badURL))
                .eraseToAnyPublisher()
        }
        
        return session.dataTaskPublisher(for: url)
            .map(\.data)
            .decode(type: [RoleplayTurn].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
}
```

### Roleplay View Model

```swift
import SwiftUI
import Combine

class RoleplayViewModel: ObservableObject {
    @Published var roleplay: Roleplay?
    @Published var currentSession: RoleplaySession?
    @Published var currentTurn: RoleplayTurn?
    @Published var userInput: String = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var showingCompletion = false
    
    private let apiService = DialoguaAPIService()
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - Load Roleplay
    func loadRoleplay(contentItemId: Int) {
        isLoading = true
        errorMessage = nil
        
        apiService.fetchRoleplay(contentItemId: contentItemId)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] roleplays in
                    guard let roleplay = roleplays.first else {
                        self?.errorMessage = "No roleplay found"
                        return
                    }
                    self?.setupRoleplay(roleplay)
                }
            )
            .store(in: &cancellables)
    }
    
    // MARK: - Setup Roleplay Session
    private func setupRoleplay(_ roleplay: Roleplay) {
        self.roleplay = roleplay
        self.currentSession = RoleplaySession(roleplayId: roleplay.id)
        
        // Start with the first turn (character's opening)
        if let turns = roleplay.turns?.sorted(by: { $0.turnOrder < $1.turnOrder }),
           let firstTurn = turns.first {
            self.currentTurn = firstTurn
        }
    }
    
    // MARK: - Submit User Response
    func submitUserResponse() {
        guard let session = currentSession,
              let roleplay = roleplay,
              let turns = roleplay.turns?.sorted(by: { $0.turnOrder < $1.turnOrder }),
              !userInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return
        }
        
        // Add user response to session
        var updatedSession = session
        updatedSession.userResponses.append(userInput)
        
        // Move to next turn
        let nextTurnIndex = session.currentTurnIndex + 1
        
        if nextTurnIndex < turns.count {
            // Continue conversation
            updatedSession.currentTurnIndex = nextTurnIndex
            self.currentSession = updatedSession
            self.currentTurn = turns[nextTurnIndex]
        } else {
            // Complete roleplay
            updatedSession.isCompleted = true
            updatedSession.completedAt = Date()
            self.currentSession = updatedSession
            self.showingCompletion = true
        }
        
        // Clear input
        userInput = ""
    }
    
    // MARK: - Reset Roleplay
    func resetRoleplay() {
        guard let roleplay = roleplay else { return }
        setupRoleplay(roleplay)
        showingCompletion = false
    }
    
    // MARK: - Get Progress
    var progress: Double {
        guard let session = currentSession,
              let roleplay = roleplay,
              let turnsCount = roleplay.turns?.count else {
            return 0.0
        }
        
        return Double(session.currentTurnIndex) / Double(turnsCount)
    }
    
    // MARK: - Get Expected Response
    var expectedResponse: String? {
        guard let session = currentSession,
              let roleplay = roleplay,
              let turns = roleplay.turns?.sorted(by: { $0.turnOrder < $1.turnOrder }) else {
            return nil
        }
        
        let currentIndex = session.currentTurnIndex
        
        // Find the next user turn
        for turn in turns[currentIndex...] {
            if turn.speaker == .user {
                return turn.message
            }
        }
        
        return nil
    }
}
```

## Complete Implementation Examples

### Roleplay View

```swift
import SwiftUI

struct RoleplayView: View {
    @StateObject private var viewModel = RoleplayViewModel()
    let contentItemId: Int
    
    var body: some View {
        VStack(spacing: 0) {
            // Header with progress
            RoleplayHeaderView(
                scenario: viewModel.roleplay?.scenario ?? "",
                characterName: viewModel.roleplay?.characterName ?? "",
                progress: viewModel.progress
            )
            
            // Conversation area
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 16) {
                        // Instructions
                        if let instructions = viewModel.roleplay?.instructions {
                            InstructionsCard(instructions: instructions)
                        }
                        
                        // Conversation turns
                        ConversationView(
                            roleplay: viewModel.roleplay,
                            currentSession: viewModel.currentSession,
                            currentTurn: viewModel.currentTurn
                        )
                    }
                    .padding()
                }
                .onChange(of: viewModel.currentTurn) { _ in
                    withAnimation {
                        proxy.scrollTo("bottom", anchor: .bottom)
                    }
                }
            }
            
            // Input area
            if !viewModel.showingCompletion {
                RoleplayInputView(
                    userInput: $viewModel.userInput,
                    expectedResponse: viewModel.expectedResponse,
                    onSubmit: viewModel.submitUserResponse
                )
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            viewModel.loadRoleplay(contentItemId: contentItemId)
        }
        .overlay {
            if viewModel.isLoading {
                ProgressView("Loading roleplay...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.black.opacity(0.3))
            }
        }
        .sheet(isPresented: $viewModel.showingCompletion) {
            RoleplayCompletionView(
                session: viewModel.currentSession,
                onRestart: viewModel.resetRoleplay
            )
        }
        .alert("Error", isPresented: .constant(viewModel.errorMessage != nil)) {
            Button("OK") {
                viewModel.errorMessage = nil
            }
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
    }
}
```

## UI Components

### Roleplay Header View

```swift
struct RoleplayHeaderView: View {
    let scenario: String
    let characterName: String
    let progress: Double
    
    var body: some View {
        VStack(spacing: 12) {
            // Progress bar
            ProgressView(value: progress)
                .progressViewStyle(LinearProgressViewStyle(tint: .blue))
            
            // Scenario and character info
            VStack(alignment: .leading, spacing: 8) {
                Text("Scenario")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text(scenario)
                    .font(.body)
                    .fontWeight(.medium)
                
                HStack {
                    Image(systemName: "person.circle.fill")
                        .foregroundColor(.blue)
                    Text("Character: \(characterName)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding()
        .background(Color(.systemGray6))
    }
}
```

### Conversation View

```swift
struct ConversationView: View {
    let roleplay: Roleplay?
    let currentSession: RoleplaySession?
    let currentTurn: RoleplayTurn?
    
    var body: some View {
        VStack(spacing: 16) {
            if let roleplay = roleplay,
               let turns = roleplay.turns?.sorted(by: { $0.turnOrder < $1.turnOrder }),
               let session = currentSession {
                
                ForEach(Array(turns.prefix(session.currentTurnIndex + 1).enumerated()), id: \.element.id) { index, turn in
                    ConversationBubble(
                        turn: turn,
                        userResponse: index < session.userResponses.count ? session.userResponses[index] : nil,
                        isCurrentTurn: turn.id == currentTurn?.id
                    )
                }
            }
            
            // Invisible anchor for scrolling
            Color.clear
                .frame(height: 1)
                .id("bottom")
        }
    }
}

struct ConversationBubble: View {
    let turn: RoleplayTurn
    let userResponse: String?
    let isCurrentTurn: Bool
    
    var body: some View {
        VStack(alignment: turn.speaker == .character ? .leading : .trailing, spacing: 8) {
            // Character message
            if turn.speaker == .character {
                HStack {
                    Image(systemName: "person.circle.fill")
                        .foregroundColor(.blue)
                    
                    Text(turn.message)
                        .padding()
                        .background(Color.blue.opacity(0.1))
                        .cornerRadius(16)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            
            // User response (if provided)
            if let userResponse = userResponse, turn.speaker == .user {
                HStack {
                    Spacer()
                    Text(userResponse)
                        .padding()
                        .background(Color.green.opacity(0.1))
                        .cornerRadius(16)
                        .frame(maxWidth: .infinity, alignment: .trailing)
                    
                    Image(systemName: "person.circle.fill")
                        .foregroundColor(.green)
                }
            }
            
            // Expected response hint (for current user turn)
            if turn.speaker == .user && isCurrentTurn {
                Text("Expected: \(turn.message)")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.horizontal)
                    .frame(maxWidth: .infinity, alignment: .trailing)
            }
        }
        .animation(.easeInOut, value: isCurrentTurn)
    }
}
```

### Roleplay Input View

```swift
struct RoleplayInputView: View {
    @Binding var userInput: String
    let expectedResponse: String?
    let onSubmit: () -> Void
    
    var body: some View {
        VStack(spacing: 12) {
            // Expected response hint
            if let expected = expectedResponse {
                HStack {
                    Image(systemName: "lightbulb")
                        .foregroundColor(.orange)
                    Text("Try saying: \(expected)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                }
                .padding(.horizontal)
            }
            
            // Input field
            HStack {
                TextField("Type your response...", text: $userInput)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .onSubmit(onSubmit)
                
                Button(action: onSubmit) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.title2)
                        .foregroundColor(userInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? .gray : .blue)
                }
                .disabled(userInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .padding()
        }
        .background(Color(.systemBackground))
        .shadow(radius: 1)
    }
}
```

### Instructions Card

```swift
struct InstructionsCard: View {
    let instructions: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "info.circle.fill")
                    .foregroundColor(.blue)
                Text("Instructions")
                    .font(.headline)
                    .fontWeight(.semibold)
                Spacer()
            }
            
            Text(instructions)
                .font(.body)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color.blue.opacity(0.05))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.blue.opacity(0.2), lineWidth: 1)
        )
    }
}
```

### Roleplay Completion View

```swift
struct RoleplayCompletionView: View {
    let session: RoleplaySession?
    let onRestart: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            // Success icon
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 60))
                .foregroundColor(.green)
            
            // Completion message
            VStack(spacing: 8) {
                Text("Roleplay Complete!")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("Great job! You've successfully completed the conversation.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            
            // Statistics
            if let session = session {
                VStack(spacing: 12) {
                    StatRow(title: "Responses", value: "\(session.userResponses.count)")
                    StatRow(title: "Duration", value: formatDuration(session.startedAt, session.completedAt))
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
            }
            
            // Actions
            VStack(spacing: 12) {
                Button("Try Again") {
                    onRestart()
                }
                .buttonStyle(.borderedProminent)
                
                Button("Continue Learning") {
                    // Navigate back or to next content
                }
                .buttonStyle(.bordered)
            }
        }
        .padding()
    }
    
    private func formatDuration(_ start: Date, _ end: Date?) -> String {
        guard let end = end else { return "N/A" }
        let duration = end.timeIntervalSince(start)
        let minutes = Int(duration) / 60
        let seconds = Int(duration) % 60
        return "\(minutes)m \(seconds)s"
    }
}

struct StatRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.semibold)
        }
    }
}
```

## Error Handling

### Roleplay Error Types

```swift
enum RoleplayError: LocalizedError {
    case noRoleplayFound
    case invalidTurnOrder
    case sessionNotFound
    case networkError(Error)
    
    var errorDescription: String? {
        switch self {
        case .noRoleplayFound:
            return "No roleplay found for this content item"
        case .invalidTurnOrder:
            return "Invalid turn order in roleplay data"
        case .sessionNotFound:
            return "Roleplay session not found"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        }
    }
}
```

## Best Practices

### 1. Data Management
- Cache roleplay data locally for offline access
- Implement proper error handling for network failures
- Use proper state management for conversation flow

### 2. User Experience
- Provide clear instructions and hints
- Show progress indicators
- Allow users to restart conversations
- Implement proper keyboard handling

### 3. Performance
- Lazy load conversation turns
- Optimize scroll performance with proper view recycling
- Cache API responses appropriately

### 4. Accessibility
- Provide proper voice-over support
- Ensure sufficient color contrast
- Support dynamic type sizing

## Testing Checklist

- [ ] Roleplay data loads correctly
- [ ] Conversation flow works properly
- [ ] User input validation works
- [ ] Progress tracking is accurate
- [ ] Completion flow functions correctly
- [ ] Error states are handled gracefully
- [ ] UI is responsive and accessible
- [ ] Offline functionality works (if implemented)

## Integration with Main App

To integrate roleplay features into your main app:

1. Add the roleplay models to your data layer
2. Extend your API service with roleplay methods
3. Create roleplay views and view models
4. Add navigation from content items to roleplay views
5. Implement progress tracking and completion handling

This comprehensive guide provides everything needed to successfully integrate roleplay features into your Swift client application.