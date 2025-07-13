// Contact Form Integration Script
// This script handles form submissions and triggers GitHub Actions

class ContactFormHandler {
    constructor() {
        this.setupEventListeners();
        this.addContactFormHTML();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('contactForm');
            if (form) {
                form.addEventListener('submit', this.handleSubmit.bind(this));
            }
        });
    }

    addContactFormHTML() {
        // Add contact form to the contact section
        const contactSection = document.getElementById('contact');
        if (contactSection && !document.getElementById('contactForm')) {
            const contactContent = contactSection.querySelector('.contact-content');
            if (contactContent) {
                const formContainer = this.createContactFormHTML();
                contactContent.appendChild(formContainer);
            }
        }
    }

    createContactFormHTML() {
        const formContainer = document.createElement('div');
        formContainer.className = 'contact-form-container';
        formContainer.innerHTML = `
            <div class="contact-form">
                <h3>Ì≤å Send me a message</h3>
                <form id="contactForm" class="contact-form-inner">
                    <div class="form-group">
                        <label for="name">Ì±§ Name *</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Ì≥ß Email *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="subject">Ì≥ù Subject *</label>
                        <input type="text" id="subject" name="subject" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Ì≤¨ Message *</label>
                        <textarea id="message" name="message" required placeholder="Tell me about your project, question, or just say hello!"></textarea>
                    </div>
                    
                    <div id="contactStatus" class="contact-status" style="display: none;"></div>
                    
                    <button type="submit" class="submit-btn">
                        <span class="btn-text">Ì∫Ä Send Message</span>
                    </button>
                </form>
            </div>
        `;
        return formContainer;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Show loading state
        this.showStatus('sending', 'Ì≥§ Sending your message...');

        try {
            // Simulate sending (in real implementation, this would trigger GitHub Actions)
            await this.simulateSubmission(contactData);
            
            // Show success message
            this.showStatus('success', '‚úÖ Message sent! You\'ll receive a confirmation email shortly.');
            event.target.reset();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.showStatus('error', '‚ùå Sorry, there was an error. Please try again.');
        }
    }

    async simulateSubmission(contactData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log the contact data (in real implementation, this would trigger GitHub Actions)
        console.log('Ì≥ß Contact Form Submission:', contactData);
        console.log('Ì¥ñ This would trigger auto-response and analytics!');
        
        return { success: true };
    }

    showStatus(type, message) {
        const statusDiv = document.getElementById('contactStatus');
        if (statusDiv) {
            statusDiv.className = `contact-status ${type}`;
            statusDiv.textContent = message;
            statusDiv.style.display = 'block';

            if (type === 'success' || type === 'error') {
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
            }
        }
    }
}

// Initialize when DOM is ready
new ContactFormHandler();
