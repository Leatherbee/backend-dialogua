# API Integration Guide for Swift Client App

This guide provides comprehensive documentation for integrating the Dialogua backend API with your Swift client application.

## Base URL
```
http://localhost:9000
```

## Table of Contents
1. [Authentication](#authentication)
2. [Core Data Models](#core-data-models)
3. [API Endpoints](#api-endpoints)
4. [Swift Implementation Examples](#swift-implementation-examples)
5. [Home View Data Fetching](#home-view-data-fetching)
6. [Level Details Navigation](#level-details-navigation)
7. [Error Handling](#error-handling)

## Authentication

Currently, the API doesn't require authentication for content retrieval. However, user progress tracking will require authentication.

## Core Data Models

### Swift Data Models

```swift
// MARK: - Program
struct Program: Codable, Identifiable {
    let id: Int
    let name: String
    let description: String?
    let metadata: [String: Any]?
    let createdAt: String
    let updatedAt: String
    
    enum CodingKeys: String, CodingKey {
        case id, name, description, metadata, createdAt, updatedAt
    }
}

// MARK: - Unit Level
struct UnitLevel: Codable, Identifiable {
    let id: Int
    let name: String
    let description: String?
    let level: Int
    let position: Int
    let unitId: Int
    let metadata: [String: Any]?
    
    enum CodingKeys: String, CodingKey {
        case id, name, description, level, position
        case unitId = "unit_id"
        case metadata
    }
}

// MARK: - Content Item
struct ContentItem: Codable, Identifiable {
    let id: Int
    let contentType: ContentType
    let title: String
    let description: String?
    let content: String?
    let position: Int
    let unitLevelId: Int
    let mediaAssetId: Int?
    let metadata: [String: Any]?
    let mediaAsset: MediaAsset?
    let quiz: Quiz?
    let roleplay: Roleplay?
    
    enum ContentType: String, Codable {
        case quiz = "quiz"
        case roleplay = "roleplay"
        case form = "form"
        case matching = "matching"
    }
    
    enum CodingKeys: String, CodingKey {
        case id, title, description, content, position, metadata
        case contentType = "content_type"
        case unitLevelId = "unit_level_id"
        case mediaAssetId = "media_asset_id"
        case mediaAsset = "media_asset"
        case quiz, roleplay
    }
}

// MARK: - Media Asset
struct MediaAsset: Codable, Identifiable {
    let id: Int
    let mediaType: MediaType
    let url: String
    let durationSec: Double?
    let transcript: String?
    let altText: String?
    let metadata: [String: Any]?
    
    enum MediaType: String, Codable {
        case image = "image"
        case video = "video"
        case audio = "audio"
        case document = "document"
    }
    
    enum CodingKeys: String, CodingKey {
        case id, url, transcript, metadata
        case mediaType = "media_type"
        case durationSec = "duration_sec"
        case altText = "alt_text"
    }
}

// MARK: - Quiz
struct Quiz: Codable, Identifiable {
    let id: Int
    let question: String
    let questionType: QuestionType
    let contentItemId: Int
    let metadata: [String: Any]?
    let options: [QuizOption]
    
    enum QuestionType: String, Codable {
        case multipleChoice = "multiple_choice"
        case trueFalse = "true_false"
        case fillInBlank = "fill_in_blank"
    }
    
    enum CodingKeys: String, CodingKey {
        case id, question, metadata, options
        case questionType = "question_type"
        case contentItemId = "content_item_id"
    }
}

// MARK: - Quiz Option
struct QuizOption: Codable, Identifiable {
    let id: Int
    let optionText: String
    let isCorrect: Bool
    let quizId: Int
    let metadata: [String: Any]?
    
    enum CodingKeys: String, CodingKey {
        case id, metadata
        case optionText = "option_text"
        case isCorrect = "is_correct"
        case quizId = "quiz_id"
    }
}

// MARK: - Roleplay
struct Roleplay: Codable, Identifiable {
    let id: Int
    let scenario: String
    let instructions: String?
    let characterName: String
    let characterDescription: String?
    let contentItemId: Int
    let metadata: [String: Any]?
    let turns: [RoleplayTurn]
    
    enum CodingKeys: String, CodingKey {
        case id, scenario, instructions, metadata, turns
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
    
    enum Speaker: String, Codable {
        case user = "user"
        case character = "character"
    }
    
    enum CodingKeys: String, CodingKey {
        case id, speaker, message, metadata
        case turnOrder = "turn_order"
        case roleplayId = "roleplay_id"
    }
}
```

## API Endpoints

### Core Endpoints for Home View

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/programs` | GET | Get all programs |
| `/unit-level` | GET | Get all unit levels (requires unitId parameter) |
| `/unit-level/unit/{unitId}` | GET | Get all levels for a specific unit |
| `/level/{levelId}/content` | GET | Get all content for a specific level |
| `/quizzes?contentItemId={id}` | GET | Get quizzes by content item ID |
| `/roleplay?contentItemId={id}` | GET | Get roleplay by content item ID |

### Additional Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/quizzes/{id}` | GET | Get specific quiz by ID |
| `/roleplay/{id}` | GET | Get specific roleplay by ID |
| `/roleplay-turn?roleplayId={id}` | GET | Get turns for a roleplay |
| `/media-asset/{id}` | GET | Get specific media asset |

## Swift Implementation Examples

### API Service Class

```swift
import Foundation
import Combine

class DialoguaAPIService: ObservableObject {
    private let baseURL = "http://localhost:9000"
    private let session = URLSession.shared
    
    // MARK: - Fetch Programs
    func fetchPrograms() -> AnyPublisher<[Program], Error> {
        guard let url = URL(string: "\(baseURL)/programs") else {
            return Fail(error: URLError(.badURL))
                .eraseToAnyPublisher()
        }
        
        return session.dataTaskPublisher(for: url)
            .map(\.data)
            .decode(type: [Program].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Fetch Unit Levels
    func fetchUnitLevels(for unitId: Int) -> AnyPublisher<[UnitLevel], Error> {
        guard let url = URL(string: "\(baseURL)/unit-level/unit/\(unitId)") else {
            return Fail(error: URLError(.badURL))
                .eraseToAnyPublisher()
        }
        
        return session.dataTaskPublisher(for: url)
            .map(\.data)
            .decode(type: [UnitLevel].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Fetch Level Content
    func fetchLevelContent(levelId: Int) -> AnyPublisher<[ContentItem], Error> {
        guard let url = URL(string: "\(baseURL)/level/\(levelId)/content") else {
            return Fail(error: URLError(.badURL))
                .eraseToAnyPublisher()
        }
        
        return session.dataTaskPublisher(for: url)
            .map(\.data)
            .decode(type: [ContentItem].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Fetch Quiz Details
    func fetchQuizzes(contentItemId: Int) -> AnyPublisher<[Quiz], Error> {
        guard let url = URL(string: "\(baseURL)/quizzes?contentItemId=\(contentItemId)") else {
            return Fail(error: URLError(.badURL))
                .eraseToAnyPublisher()
        }
        
        return session.dataTaskPublisher(for: url)
            .map(\.data)
            .decode(type: [Quiz].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Fetch Roleplay Details
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
}
```

## Home View Data Fetching

### Home View Model

```swift
import SwiftUI
import Combine

class HomeViewModel: ObservableObject {
    @Published var programs: [Program] = []
    @Published var unitLevels: [UnitLevel] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiService = DialoguaAPIService()
    private var cancellables = Set<AnyCancellable>()
    
    func loadHomeData() {
        isLoading = true
        errorMessage = nil
        
        // Fetch programs and unit levels simultaneously
        Publishers.Zip(
            apiService.fetchPrograms(),
            apiService.fetchUnitLevels()
        )
        .sink(
            receiveCompletion: { [weak self] completion in
                DispatchQueue.main.async {
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                }
            },
            receiveValue: { [weak self] programs, unitLevels in
                DispatchQueue.main.async {
                    self?.programs = programs
                    self?.unitLevels = unitLevels
                }
            }
        )
        .store(in: &cancellables)
    }
    
    // Group unit levels by level number for display
    var groupedLevels: [Int: [UnitLevel]] {
        Dictionary(grouping: unitLevels, by: { $0.level })
    }
}
```

### Home View

```swift
import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(spacing: 16) {
                    // Programs Section
                    if !viewModel.programs.isEmpty {
                        ProgramsSection(programs: viewModel.programs)
                    }
                    
                    // Levels Section
                    LevelsSection(
                        groupedLevels: viewModel.groupedLevels,
                        onLevelTap: { level in
                            // Navigate to level details
                        }
                    )
                }
                .padding()
            }
            .navigationTitle("Dialogua")
            .refreshable {
                viewModel.loadHomeData()
            }
        }
        .onAppear {
            viewModel.loadHomeData()
        }
        .overlay {
            if viewModel.isLoading {
                ProgressView("Loading...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.black.opacity(0.3))
            }
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

struct ProgramsSection: View {
    let programs: [Program]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Programs")
                .font(.title2)
                .fontWeight(.bold)
            
            ForEach(programs) { program in
                ProgramCard(program: program)
            }
        }
    }
}

struct LevelsSection: View {
    let groupedLevels: [Int: [UnitLevel]]
    let onLevelTap: (Int) -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Levels")
                .font(.title2)
                .fontWeight(.bold)
            
            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 16) {
                ForEach(groupedLevels.keys.sorted(), id: \.self) { levelNumber in
                    LevelCard(
                        levelNumber: levelNumber,
                        unitLevels: groupedLevels[levelNumber] ?? [],
                        onTap: { onLevelTap(levelNumber) }
                    )
                }
            }
        }
    }
}
```

## Level Details Navigation

### Level Details View Model

```swift
class LevelDetailsViewModel: ObservableObject {
    @Published var contentItems: [ContentItem] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiService = DialoguaAPIService()
    private var cancellables = Set<AnyCancellable>()
    
    func loadLevelContent(levelId: Int) {
        isLoading = true
        errorMessage = nil
        
        apiService.fetchLevelContent(levelId: levelId)
            .sink(
                receiveCompletion: { [weak self] completion in
                    DispatchQueue.main.async {
                        self?.isLoading = false
                        if case .failure(let error) = completion {
                            self?.errorMessage = error.localizedDescription
                        }
                    }
                },
                receiveValue: { [weak self] contentItems in
                    DispatchQueue.main.async {
                        self?.contentItems = contentItems.sorted { $0.position < $1.position }
                    }
                }
            )
            .store(in: &cancellables)
    }
    
    // Separate quizzes and roleplays
    var quizzes: [ContentItem] {
        contentItems.filter { $0.contentType == .quiz }
    }
    
    var roleplays: [ContentItem] {
        contentItems.filter { $0.contentType == .roleplay }
    }
}
```

### Level Details View

```swift
struct LevelDetailsView: View {
    let levelId: Int
    @StateObject private var viewModel = LevelDetailsViewModel()
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 20) {
                // Quizzes Section
                if !viewModel.quizzes.isEmpty {
                    QuizzesSection(quizzes: viewModel.quizzes)
                }
                
                // Roleplays Section
                if !viewModel.roleplays.isEmpty {
                    RoleplaysSection(roleplays: viewModel.roleplays)
                }
            }
            .padding()
        }
        .navigationTitle("Level \(levelId)")
        .navigationBarTitleDisplayMode(.large)
        .onAppear {
            viewModel.loadLevelContent(levelId: levelId)
        }
        .overlay {
            if viewModel.isLoading {
                ProgressView("Loading level content...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.black.opacity(0.3))
            }
        }
    }
}

struct QuizzesSection: View {
    let quizzes: [ContentItem]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quizzes")
                .font(.title2)
                .fontWeight(.bold)
            
            ForEach(quizzes) { quiz in
                NavigationLink(destination: QuizDetailView(contentItem: quiz)) {
                    QuizCard(contentItem: quiz)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }
}

struct RoleplaysSection: View {
    let roleplays: [ContentItem]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Roleplays")
                .font(.title2)
                .fontWeight(.bold)
            
            ForEach(roleplays) { roleplay in
                NavigationLink(destination: RoleplayDetailView(contentItem: roleplay)) {
                    RoleplayCard(contentItem: roleplay)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }
}
```

### Quiz Detail View

```swift
struct QuizDetailView: View {
    let contentItem: ContentItem
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Media Asset (if available)
                if let mediaAsset = contentItem.mediaAsset {
                    MediaAssetView(mediaAsset: mediaAsset)
                }
                
                // Quiz Content
                if let quiz = contentItem.quiz {
                    QuizContentView(quiz: quiz)
                }
            }
            .padding()
        }
        .navigationTitle(contentItem.title)
        .navigationBarTitleDisplayMode(.large)
    }
}

struct MediaAssetView: View {
    let mediaAsset: MediaAsset
    
    var body: some View {
        VStack {
            switch mediaAsset.mediaType {
            case .image:
                AsyncImage(url: URL(string: "http://localhost:9000\(mediaAsset.url)")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                } placeholder: {
                    ProgressView()
                        .frame(height: 200)
                }
                
            case .video:
                // Implement video player
                Text("Video: \(mediaAsset.url)")
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
                
            case .audio:
                // Implement audio player
                Text("Audio: \(mediaAsset.url)")
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
                
            case .document:
                Text("Document: \(mediaAsset.url)")
                    .padding()
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
            }
        }
    }
}
```

## Error Handling

### Custom Error Types

```swift
enum DialoguaAPIError: Error, LocalizedError {
    case invalidURL
    case noData
    case decodingError(Error)
    case networkError(Error)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .noData:
            return "No data received"
        case .decodingError(let error):
            return "Failed to decode data: \(error.localizedDescription)"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        }
    }
}
```

## Usage Examples

### Basic Implementation

```swift
// In your App.swift or main view
struct ContentView: View {
    var body: some View {
        HomeView()
    }
}

// Navigation from Home to Level Details
NavigationLink(destination: LevelDetailsView(levelId: levelNumber)) {
    LevelCard(levelNumber: levelNumber, unitLevels: unitLevels)
}
```

### Testing API Endpoints

You can test the API endpoints using curl commands:

```bash
# Get all programs
curl -X GET "http://localhost:9000/program"

# Get all unit levels
curl -X GET "http://localhost:9000/unit-level"

# Get Level 1 content
curl -X GET "http://localhost:9000/level/1/content"

# Get Level 2 content
curl -X GET "http://localhost:9000/level/2/content"

# Get specific roleplay
curl -X GET "http://localhost:9000/roleplay?contentItemId=4"
```

## Notes

1. **Media Assets**: Media asset URLs are relative paths. Prepend the base URL to access them.
2. **Error Handling**: Always implement proper error handling for network requests.
3. **Loading States**: Show loading indicators during API calls for better UX.
4. **Caching**: Consider implementing caching for frequently accessed data.
5. **Offline Support**: Plan for offline functionality with local data storage.

This guide provides a complete foundation for integrating your Swift app with the Dialogua backend API. Adjust the implementation based on your specific UI requirements and app architecture.