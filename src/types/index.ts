// User types
export interface User {
  uid: string;
  email: string;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  defaultView: 'feed' | 'archive';
}

// Link types
export interface Link {
  id: string;
  userId: string;
  url: string;

  // Metadata (Open Graph)
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;

  // User data
  memo: string | null;
  tags: string[];

  // State
  isArchived: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

// API types
export interface LinkPreview {
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
}

export interface CreateLinkInput {
  url: string;
}

export interface UpdateLinkInput {
  memo?: string;
  tags?: string[];
  isArchived?: boolean;
}
