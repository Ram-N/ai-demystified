// Accordion functionality for advanced content and callouts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all accordion elements as collapsed
    const accordionElements = document.querySelectorAll('.advanced-content, .callout-advanced, .callout-info, .callout-warning');
    
    accordionElements.forEach(function(element) {
        // Start collapsed
        element.classList.add('collapsed');
        element.classList.remove('expanded');
        
        // Add click event listener
        element.addEventListener('click', function() {
            toggleAccordion(this);
        });
    });
    
    function toggleAccordion(element) {
        if (element.classList.contains('collapsed')) {
            // Expand
            element.classList.remove('collapsed');
            element.classList.add('expanded');
        } else {
            // Collapse
            element.classList.remove('expanded');
            element.classList.add('collapsed');
        }
    }
    
    // Smooth height transition for better UX
    const style = document.createElement('style');
    style.textContent = `
        .advanced-content, .callout {
            transition: max-height 0.3s ease-in-out, opacity 0.2s ease;
        }
        
        .advanced-content.collapsed, .callout.collapsed {
            opacity: 0.8;
        }
        
        .advanced-content.expanded, .callout.expanded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});