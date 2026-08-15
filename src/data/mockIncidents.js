// SangyanAI Mock Data Layer
// 20 incidents spread across all continents for global coverage

export const mockIncidents = [
  { id: 1, type: "earthquake", severity: "high", lat: 35.6762, lng: 139.6503, location: "Tokyo, Japan", magnitude: 6.1, time: Date.now() - 120000, description: "Major seismic activity detected" },
  { id: 2, type: "flood", severity: "medium", lat: 23.8103, lng: 90.4125, location: "Dhaka, Bangladesh", time: Date.now() - 300000, description: "Flash flooding in urban areas" },
  { id: 3, type: "earthquake", severity: "high", lat: -34.6037, lng: -58.3816, location: "Buenos Aires, Argentina", magnitude: 5.8, time: Date.now() - 180000, description: "Aftershock sequence ongoing" },
  { id: 4, type: "storm", severity: "high", lat: 14.5995, lng: 120.9842, location: "Manila, Philippines", time: Date.now() - 60000, description: "Category 4 typhoon approaching" },
  { id: 5, type: "wildfire", severity: "medium", lat: -33.8688, lng: 151.2093, location: "Sydney, Australia", time: Date.now() - 240000, description: "Bushfire spreading northeast" },
  { id: 6, type: "earthquake", severity: "low", lat: 37.7749, lng: -122.4194, location: "San Francisco, USA", magnitude: 3.2, time: Date.now() - 540000, description: "Minor tremor detected" },
  { id: 7, type: "flood", severity: "high", lat: 28.6139, lng: 77.2090, location: "New Delhi, India", time: Date.now() - 90000, description: "Yamuna river breach alert" },
  { id: 8, type: "storm", severity: "medium", lat: 25.2048, lng: 55.2708, location: "Dubai, UAE", time: Date.now() - 420000, description: "Sandstorm warning issued" },
  { id: 9, type: "earthquake", severity: "medium", lat: 41.0082, lng: 28.9784, location: "Istanbul, Turkey", magnitude: 4.5, time: Date.now() - 360000, description: "Moderate seismic event" },
  { id: 10, type: "volcano", severity: "high", lat: -8.3405, lng: 115.0920, location: "Bali, Indonesia", time: Date.now() - 150000, description: "Volcanic eruption imminent" },
  { id: 11, type: "flood", severity: "low", lat: 51.5074, lng: -0.1278, location: "London, UK", time: Date.now() - 600000, description: "Thames barrier activated" },
  { id: 12, type: "earthquake", severity: "medium", lat: -22.9068, lng: -43.1729, location: "Rio de Janeiro, Brazil", magnitude: 4.0, time: Date.now() - 480000, description: "Seismic monitoring active" },
  { id: 13, type: "storm", severity: "high", lat: 29.7604, lng: -95.3698, location: "Houston, USA", time: Date.now() - 30000, description: "Hurricane force winds detected" },
  { id: 14, type: "wildfire", severity: "medium", lat: 38.7223, lng: -9.1393, location: "Lisbon, Portugal", time: Date.now() - 270000, description: "Forest fire containment 40%" },
  { id: 15, type: "earthquake", severity: "low", lat: 55.7558, lng: 37.6173, location: "Moscow, Russia", magnitude: 2.8, time: Date.now() - 720000, description: "Micro-seismic activity" },
  { id: 16, type: "flood", severity: "high", lat: 13.7563, lng: 100.5018, location: "Bangkok, Thailand", time: Date.now() - 45000, description: "Urban flooding critical" },
  { id: 17, type: "storm", severity: "medium", lat: -1.2921, lng: 36.8219, location: "Nairobi, Kenya", time: Date.now() - 330000, description: "Severe thunderstorm alert" },
  { id: 18, type: "earthquake", severity: "high", lat: 19.4326, lng: -99.1332, location: "Mexico City, Mexico", magnitude: 5.4, time: Date.now() - 200000, description: "Significant seismic event" },
  { id: 19, type: "volcano", severity: "medium", lat: 64.1466, lng: -21.9426, location: "Reykjavik, Iceland", time: Date.now() - 510000, description: "Volcanic activity escalating" },
  { id: 20, type: "flood", severity: "low", lat: 30.0444, lng: 31.2357, location: "Cairo, Egypt", time: Date.now() - 660000, description: "Nile flooding monitored" },
];

export const mockAgentPipeline = {
  monitor: {
    status: "active",
    lastScan: "3s ago",
    sourcesChecked: 4,
    sources: ["USGS Seismic Network", "Open-Meteo Weather", "GDACS Alerts", "NASA FIRMS"],
    log: [
      "Scanning USGS real-time feed…",
      "4 sources connected — latency 12ms",
      "New seismic event detected: 35.67°N, 139.65°E",
      "Severity threshold exceeded — forwarding to Analyzer",
    ],
  },
  analyzer: {
    status: "processing",
    severityScore: 7.8,
    confidence: 0.91,
    log: [
      "Receiving incident data from Monitor…",
      "Cross-referencing historical seismic patterns…",
      "Population density overlay: 14.2M in radius",
      "Severity score: 7.8 | Confidence: 91%",
      "Classifying as HIGH — escalating to Responder",
    ],
  },
  responder: {
    status: "complete",
    actionPlan: [
      "Deploy regional alert to 14.2M residents",
      "Notify local authorities + emergency services",
      "Activate shelter network (23 locations)",
      "Dispatch medical teams to 3 priority zones",
    ],
    log: [
      "Receiving escalation from Analyzer…",
      "Generating multi-layer response plan…",
      "Alert deployed to regional broadcast network",
      "23 shelter locations activated successfully",
      "Response plan complete — monitoring for aftershocks",
    ],
  },
};

export const techStack = [
  { name: "React", color: "#61DAFB" },
  { name: "Three.js", color: "#FFFFFF" },
  { name: "AI Engine", color: "#FF4D2E" },
  { name: "Real-time", color: "#FFB020" },
  { name: "USGS API", color: "#3ECF8E" },
  { name: "WebSocket", color: "#7B8CFF" },
];

// Arc connections (pairs of incident IDs that show data flow)
export const mockArcs = [
  [0, 3],   // Tokyo → Manila
  [6, 9],   // Delhi → Bali
  [5, 12],  // San Francisco → Houston
  [8, 10],  // Istanbul → London
  [2, 11],  // Buenos Aires → Rio
  [16, 7],  // Nairobi → Dubai
];
