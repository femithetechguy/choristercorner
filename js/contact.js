/**
 * Contact Tab Implementation for ChoristerCorner
 * Handles contact forms, feedback, suggestions, and support information
 */

console.log("[DEBUG] Contact tab module loaded");

// Contact tab data and state
const contactData = {
  formTypes: {
    general: "General Contact",
    feedback: "Feedback",
    songSuggestion: "Song Suggestion",
    bugReport: "Bug Report",
    featureRequest: "Feature Request"
  },
  currentFormType: "general",
  formData: {
    name: "",
    email: "",
    subject: "",
    message: "",
    formType: "general"
  },
  socialLinks: [
    {
      platform: "GitHub",
      icon: "bi-github",
      url: "#",
      description: "View source code and contribute"
    },
    {
      platform: "Twitter",
      icon: "bi-twitter",
      url: "#",
      description: "Follow us for updates"
    },
    {
      platform: "Email",
      icon: "bi-envelope",
      url: "mailto:contact@choristercorner.com",
      description: "Direct email contact"
    }
  ]
};

// Render the Contact tab content
window.renderContactTab = function(tab) {
  console.log("[DEBUG] Rendering Contact tab");
  
  return `
    <div class="fade-in space-y-8">
      <!-- Contact Header -->
      <div class="text-center">
        <div class="mx-auto mb-6">
          <i class="bi bi-envelope text-6xl text-purple-600"></i>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          We'd love to hear from you! Whether you have feedback, suggestions, or need support, 
          we're here to help make ChoristerCorner better for everyone.
        </p>
      </div>

      <!-- Contact Methods -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="card-body">
            <i class="bi bi-chat-dots text-3xl text-blue-600 mb-3"></i>
            <h3 class="font-semibold text-gray-900 mb-2">General Feedback</h3>
            <p class="text-sm text-gray-600 mb-4">Share your thoughts and experiences</p>
            <button onclick="setFormType('feedback')" class="btn btn-primary btn-sm">
              Give Feedback
            </button>
          </div>
        </div>
        
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="card-body">
            <i class="bi bi-music-note-beamed text-3xl text-green-600 mb-3"></i>
            <h3 class="font-semibold text-gray-900 mb-2">Song Suggestions</h3>
            <p class="text-sm text-gray-600 mb-4">Suggest songs to add to our library</p>
            <button onclick="setFormType('songSuggestion')" class="btn btn-secondary btn-sm">
              Suggest Song
            </button>
          </div>
        </div>
        
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="card-body">
            <i class="bi bi-bug text-3xl text-orange-600 mb-3"></i>
            <h3 class="font-semibold text-gray-900 mb-2">Report Issues</h3>
            <p class="text-sm text-gray-600 mb-4">Found a bug or have technical issues?</p>
            <button onclick="setFormType('bugReport')" class="btn btn-outline btn-sm">
              Report Bug
            </button>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="card">
            <div class="card-header">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <i class="bi bi-envelope mr-2"></i>
                Contact Form
              </h2>
              <p class="text-sm text-gray-600 mt-1">
                Currently showing: <span class="font-medium text-purple-600">${contactData.formTypes[contactData.currentFormType]}</span>
              </p>
            </div>
            <div class="card-body">
              <form id="contact-form" onsubmit="handleFormSubmit(event)">
                <!-- Form Type Selector -->
                <div class="form-group">
                  <label class="form-label">Contact Type</label>
                  <select id="form-type" class="form-select" onchange="handleFormTypeChange(this.value)">
                    ${Object.entries(contactData.formTypes).map(([key, label]) => 
                      `<option value="${key}" ${key === contactData.currentFormType ? 'selected' : ''}>${label}</option>`
                    ).join('')}
                  </select>
                </div>

                <!-- Name Field -->
                <div class="form-group">
                  <label for="contact-name" class="form-label">Name *</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    class="form-input" 
                    placeholder="Your full name"
                    value="${contactData.formData.name}"
                    oninput="updateFormData('name', this.value)"
                    required
                  >
                </div>

                <!-- Email Field -->
                <div class="form-group">
                  <label for="contact-email" class="form-label">Email *</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    class="form-input" 
                    placeholder="your.email@example.com"
                    value="${contactData.formData.email}"
                    oninput="updateFormData('email', this.value)"
                    required
                  >
                  <div class="form-help">We'll use this to respond to your message</div>
                </div>

                <!-- Subject Field -->
                <div class="form-group">
                  <label for="contact-subject" class="form-label">Subject *</label>
                  <input 
                    type="text" 
                    id="contact-subject" 
                    class="form-input" 
                    placeholder="${getSubjectPlaceholder()}"
                    value="${contactData.formData.subject}"
                    oninput="updateFormData('subject', this.value)"
                    required
                  >
                </div>

                <!-- Message Field -->
                <div class="form-group">
                  <label for="contact-message" class="form-label">Message *</label>
                  <textarea 
                    id="contact-message" 
                    class="form-textarea" 
                    rows="6"
                    placeholder="${getMessagePlaceholder()}"
                    oninput="updateFormData('message', this.value)"
                    required
                  >${contactData.formData.message}</textarea>
                  <div class="form-help">Please be as detailed as possible</div>
                </div>

                <!-- Additional Fields for Song Suggestions -->
                ${contactData.currentFormType === 'songSuggestion' ? renderSongSuggestionFields() : ''}

                <!-- Submit Button -->
                <div class="flex justify-end space-x-3">
                  <button type="button" onclick="clearForm()" class="btn btn-ghost">
                    Clear Form
                  </button>
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-send"></i>
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Contact Information Sidebar -->
        <div class="space-y-6">
          <!-- Contact Info -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            <div class="card-body space-y-4">
              <div class="flex items-center space-x-3">
                <i class="bi bi-envelope text-purple-600"></i>
                <div>
                  <div class="font-medium text-gray-900">Email</div>
                  <div class="text-sm text-gray-600">contact@choristercorner.com</div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <i class="bi bi-clock text-purple-600"></i>
                <div>
                  <div class="font-medium text-gray-900">Response Time</div>
                  <div class="text-sm text-gray-600">Within 24-48 hours</div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <i class="bi bi-translate text-purple-600"></i>
                <div>
                  <div class="font-medium text-gray-900">Languages</div>
                  <div class="text-sm text-gray-600">English</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Connect With Us</h3>
            </div>
            <div class="card-body space-y-3">
              ${contactData.socialLinks.map(link => `
                <a href="${link.url}" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" target="_blank">
                  <i class="bi ${link.icon} text-xl text-gray-600"></i>
                  <div>
                    <div class="font-medium text-gray-900">${link.platform}</div>
                    <div class="text-sm text-gray-600">${link.description}</div>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>

          <!-- FAQ Quick Links -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Quick Help</h3>
            </div>
            <div class="card-body space-y-2">
              <button onclick="setFormType('general'); updateFormData('subject', 'How do I search for songs?')" class="w-full text-left p-2 rounded hover:bg-gray-50 text-sm">
                How do I search for songs?
              </button>
              <button onclick="setFormType('general'); updateFormData('subject', 'Can I download lyrics?')" class="w-full text-left p-2 rounded hover:bg-gray-50 text-sm">
                Can I download lyrics?
              </button>
              <button onclick="setFormType('featureRequest'); updateFormData('subject', 'Feature request')" class="w-full text-left p-2 rounded hover:bg-gray-50 text-sm">
                Request a new feature
              </button>
              <button onclick="setFormType('songSuggestion')" class="w-full text-left p-2 rounded hover:bg-gray-50 text-sm">
                Add a song to the library
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Guidelines -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900 flex items-center">
            <i class="bi bi-people mr-2"></i>
            Community Guidelines
          </h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">When contacting us:</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  Be respectful and kind in your communication
                </li>
                <li class="flex items-start">
                  <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  Provide clear and detailed information
                </li>
                <li class="flex items-start">
                  <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  Use appropriate subject lines
                </li>
                <li class="flex items-start">
                  <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  Be patient with response times
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">For song suggestions:</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  Ensure songs are appropriate for worship
                </li>
                <li class="flex items-start">
                  <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  Provide YouTube links when possible
                </li>
                <li class="flex items-start">
                  <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  Include artist and song information
                </li>
                <li class="flex items-start">
                  <i class="bi bi-check2 text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                  Respect copyright and licensing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Render additional fields for song suggestions
function renderSongSuggestionFields() {
  return `
    <div class="space-y-4 p-4 bg-blue-50 rounded-lg">
      <h4 class="font-medium text-gray-900 flex items-center">
        <i class="bi bi-music-note mr-2"></i>
        Song Details
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="form-label">Song Title</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="e.g., Amazing Grace"
            id="song-title"
          >
        </div>
        <div>
          <label class="form-label">Artist/Channel</label>
          <input 
            type="text" 
            class="form-input" 
            placeholder="e.g., Hillsong Worship"
            id="song-artist"
          >
        </div>
      </div>
      
      <div>
        <label class="form-label">YouTube URL (if available)</label>
        <input 
          type="url" 
          class="form-input" 
          placeholder="https://www.youtube.com/watch?v=..."
          id="song-url"
        >
      </div>
      
      <div>
        <label class="form-label">Why should we add this song?</label>
        <textarea 
          class="form-textarea" 
          rows="3"
          placeholder="Tell us why this song would be a great addition to our library..."
          id="song-reason"
        ></textarea>
      </div>
    </div>
  `;
}

// Get placeholder text for subject field based on form type
function getSubjectPlaceholder() {
  const placeholders = {
    general: "Brief description of your inquiry",
    feedback: "Your feedback about ChoristerCorner",
    songSuggestion: "Song suggestion - [Song Title] by [Artist]",
    bugReport: "Bug report - Brief description of the issue",
    featureRequest: "Feature request - Brief description"
  };
  return placeholders[contactData.currentFormType] || placeholders.general;
}

// Get placeholder text for message field based on form type
function getMessagePlaceholder() {
  const placeholders = {
    general: "Please describe your inquiry in detail...",
    feedback: "Share your thoughts, suggestions, or experiences with ChoristerCorner...",
    songSuggestion: "Provide details about the song you'd like us to add, including why it would be valuable...",
    bugReport: "Please describe the bug, including steps to reproduce it and what you expected to happen...",
    featureRequest: "Describe the feature you'd like to see and how it would improve the platform..."
  };
  return placeholders[contactData.currentFormType] || placeholders.general;
}

// Set form type and update form
function setFormType(formType) {
  contactData.currentFormType = formType;
  contactData.formData.formType = formType;
  
  // Clear form data when switching types
  contactData.formData.subject = "";
  contactData.formData.message = "";
  
  // Re-render the tab
  if (typeof window.renderAppUI === 'function') {
    window.renderAppUI();
    if (typeof setupEventListeners === 'function') {
      setupEventListeners();
    }
  }
}

// Handle form type change
function handleFormTypeChange(formType) {
  setFormType(formType);
}

// Update form data
function updateFormData(field, value) {
  contactData.formData[field] = value;
  console.log("[DEBUG] Form data updated:", field, value);
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  console.log("[DEBUG] Form submitted:", contactData.formData);
  
  // Validate form
  if (!validateForm()) {
    return;
  }
  
  // Collect additional song suggestion data if applicable
  if (contactData.currentFormType === 'songSuggestion') {
    collectSongSuggestionData();
  }
  
  // Show success message (in a real app, this would send to a server)
  showSuccessMessage();
  
  // Clear form
  setTimeout(() => {
    clearForm();
  }, 2000);
}

// Validate form data
function validateForm() {
  const { name, email, subject, message } = contactData.formData;
  
  if (!name.trim()) {
    alert('Please enter your name');
    return false;
  }
  
  if (!email.trim() || !isValidEmail(email)) {
    alert('Please enter a valid email address');
    return false;
  }
  
  if (!subject.trim()) {
    alert('Please enter a subject');
    return false;
  }
  
  if (!message.trim()) {
    alert('Please enter a message');
    return false;
  }
  
  return true;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Collect additional song suggestion data
function collectSongSuggestionData() {
  const songTitle = document.getElementById('song-title')?.value || '';
  const songArtist = document.getElementById('song-artist')?.value || '';
  const songUrl = document.getElementById('song-url')?.value || '';
  const songReason = document.getElementById('song-reason')?.value || '';
  
  contactData.formData.songDetails = {
    title: songTitle,
    artist: songArtist,
    url: songUrl,
    reason: songReason
  };
}

// Show success message
function showSuccessMessage() {
  // Create and show a temporary success message
  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in';
  successDiv.innerHTML = `
    <div class="flex items-center space-x-2">
      <i class="bi bi-check-circle"></i>
      <span>Message sent successfully! We'll get back to you soon.</span>
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  // Remove after 5 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 5000);
}

// Clear form data
function clearForm() {
  contactData.formData = {
    name: "",
    email: "",
    subject: "",
    message: "",
    formType: contactData.currentFormType
  };
  
  // Re-render the tab
  if (typeof window.renderAppUI === 'function') {
    window.renderAppUI();
    if (typeof setupEventListeners === 'function') {
      setupEventListeners();
    }
  }
}

console.log("[DEBUG] Contact tab module initialization complete");
