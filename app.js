document.addEventListener('DOMContentLoaded', () => {

    const STORAGE_KEY = 'powerpro_data';

    const sampleData = {
        customers: [
            { id: 'CUST-001', name: 'John Smith', phone: '555-0101', email: 'john.s@example.com', address: '123 Oak Ave, Metropolis', jobs: 3 },
            { id: 'CUST-002', name: 'Jane Doe', phone: '555-0102', email: 'jane.d@example.com', address: '456 Pine St, Gotham', jobs: 1 },
            { id: 'CUST-003', name: 'Bob Johnson', phone: '555-0103', email: 'bob.j@example.com', address: '789 Maple Dr, Star City', jobs: 5 },
            { id: 'CUST-004', name: 'Alice Williams', phone: '555-0104', email: 'alice.w@example.com', address: '101 Birch Ln, Central City', jobs: 2 },
        ],
        jobs: [
            { id: 'JOB-101', customer: 'John Smith', address: '123 Oak Ave', technician: 'Mike Ross', scheduled: '2025-06-20', status: 'Scheduled' },
            { id: 'JOB-102', customer: 'Jane Doe', address: '456 Pine St', technician: 'Harvey Specter', scheduled: '2025-06-19', status: 'In Progress' },
            { id: 'JOB-103', customer: 'Bob Johnson', address: '789 Maple Dr', technician: 'Mike Ross', scheduled: '2025-06-18', status: 'Completed' },
            { id: 'JOB-104', customer: 'Alice Williams', address: '101 Birch Ln', technician: 'Jessica Pearson', scheduled: '2025-06-22', status: 'Scheduled' },
            { id: 'JOB-105', customer: 'John Smith', address: '123 Oak Ave', technician: 'Louis Litt', scheduled: '2025-06-15', status: 'Cancelled' },
        ],
        electricians: [
            { id: 'ELEC-01', name: 'Mike Ross', phone: '555-0201', email: 'mike.r@powerpro.com', status: 'Available', currentJob: '-' },
            { id: 'ELEC-02', name: 'Harvey Specter', phone: '555-0202', email: 'harvey.s@powerpro.com', status: 'Assigned', currentJob: 'JOB-102' },
            { id: 'ELEC-03', name: 'Jessica Pearson', phone: '555-0203', email: 'jessica.p@powerpro.com', status: 'Available', currentJob: '-' },
            { id: 'ELEC-04', name: 'Louis Litt', phone: '555-0204', email: 'louis.l@powerpro.com', status: 'Unavailable', currentJob: '-' },
        ],
        quotes: [
            { id: 'QT-501', customer: 'Bright Future Inc.', amount: 1250.00, created: '2025-06-10', expires: '2025-07-10', status: 'Pending' },
            { id: 'QT-502', customer: 'Bob Johnson', amount: 3400.50, created: '2025-05-25', expires: '2025-06-25', status: 'Approved' },
            { id: 'QT-503', customer: 'Jane Doe', amount: 800.00, created: '2025-06-15', expires: '2025-07-15', status: 'Pending' },
            { id: 'QT-504', customer: 'Old Town Cafe', amount: 2100.00, created: '2025-05-01', expires: '2025-06-01', status: 'Expired' },
        ],
        invoices: [
            { id: 'INV-1001', customer: 'Bob Johnson', amount: 3400.50, dueDate: '2025-07-01', status: 'Paid', balance: 0.00 },
            { id: 'INV-1002', customer: 'John Smith', amount: 750.00, dueDate: '2025-06-30', status: 'Unpaid', balance: 750.00 },
            { id: 'INV-1003', customer: 'City Apartments', amount: 5200.00, dueDate: '2025-06-15', status: 'Overdue', balance: 5200.00 },
            { id: 'INV-1004', customer: 'Alice Williams', amount: 1800.00, dueDate: '2025-07-15', status: 'Partially Paid', balance: 900.00 },
        ],
        payments: [
            { id: 'PAY-801', invoice: 'INV-1001', customer: 'Bob Johnson', amount: 3400.50, method: 'Credit Card', date: '2025-06-18', receivedBy: 'Admin User' },
            { id: 'PAY-802', invoice: 'INV-1004', customer: 'Alice Williams', amount: 900.00, method: 'Bank Transfer', date: '2025-06-17', receivedBy: 'Admin User' },
        ]
    };

    const saveData = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Could not save data to localStorage", error);
        }
    };

    const loadData = () => {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (error) {
                console.error("Could not parse data from localStorage", error);
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
        }
        return null;
    };

    let data = loadData();
    if (!data) {
        data = JSON.parse(JSON.stringify(sampleData));
        saveData();
    }

    const navLinks = document.querySelectorAll('.nav-links li');
    const contentSections = document.querySelectorAll('.content-section');
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');

    const renderTable = (tbodyId, data, rowGenerator) => {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.innerHTML = data.map(rowGenerator).join('');
    };

    const createActionIcons = () => `
        <td class="action-icons">
            <i class="fas fa-eye"></i>
            <i class="fas fa-pencil-alt"></i>
            <i class="fas fa-trash-alt"></i>
        </td>`;

    const getStatusClass = (status) => `status-${status.toLowerCase().replace(' ', '-')}`;

    const renderAllTables = () => {
        renderTable('dashboard-jobs-tbody', data.jobs.slice(0, 5), item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.customer}</td>
            <td>${item.address}</td>
            <td>${item.technician}</td>
            <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
        </tr>`);
    
        renderTable('customers-table-body', data.customers, item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.email}</td>
            <td>${item.address}</td>
            <td>${item.jobs}</td>
            ${createActionIcons()}
        </tr>`);

        renderTable('jobs-table-body', data.jobs, item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.customer}</td>
            <td>${item.address}</td>
            <td>${item.technician}</td>
            <td>${item.scheduled}</td>
            <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
            ${createActionIcons()}
        </tr>`);
    
        renderTable('electricians-table-body', data.electricians, item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.email}</td>
            <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
            <td>${item.currentJob}</td>
            ${createActionIcons()}
        </tr>`);
        
        renderTable('quotes-table-body', data.quotes, item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.customer}</td>
            <td>$${item.amount.toFixed(2)}</td>
            <td>${item.created}</td>
            <td>${item.expires}</td>
            <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
            ${createActionIcons()}
        </tr>`);
        
        renderTable('invoices-table-body', data.invoices, item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.customer}</td>
            <td>$${item.amount.toFixed(2)}</td>
            <td>${item.dueDate}</td>
            <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
            <td>$${item.balance.toFixed(2)}</td>
            ${createActionIcons()}
        </tr>`);

        renderTable('payments-table-body', data.payments, item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.invoice}</td>
            <td>${item.customer}</td>
            <td>$${item.amount.toFixed(2)}</td>
            <td>${item.method}</td>
            <td>${item.date}</td>
            <td>${item.receivedBy}</td>
        </tr>`);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sectionId = link.dataset.section;

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        });
    });

    const openModal = (content) => {
        modal.innerHTML = content;
        modalOverlay.classList.add('active');
        modal.querySelector('.close-modal')?.addEventListener('click', closeModal);
        modal.querySelector('.secondary-btn')?.addEventListener('click', closeModal);
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        modal.innerHTML = '';
    };

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    const getFormHTML = (title, formFields, submitText, formType) => `
        <div class="modal-header">
            <h2>${title}</h2>
            <span class="close-modal">&times;</span>
        </div>
        <form data-form-type="${formType}">
            ${formFields}
            <div class="modal-footer">
                <button type="button" class="secondary-btn">Cancel</button>
                <button type="submit" class="primary-btn">${submitText}</button>
            </div>
        </form>
    `;

    const getCustomerForm = () => getFormHTML('Add New Customer', `
        <div class="form-group"><label for="name">Full Name</label><input type="text" id="name" required></div>
        <div class="form-group"><label for="phone">Phone</label><input type="tel" id="phone" required></div>
        <div class="form-group"><label for="email">Email</label><input type="email" id="email" required></div>
        <div class="form-group"><label for="address">Address</label><input type="text" id="address" required></div>
    `, 'Add Customer', 'customer');

    const getJobForm = () => getFormHTML('Create New Job', `
        <div class="form-group"><label for="customer">Customer</label><select id="customer" required>${data.customers.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label for="address">Job Address</label><input type="text" id="address" required></div>
        <div class="form-group"><label for="technician">Assign Technician</label><select id="technician" required>${data.electricians.filter(e => e.status === 'Available').map(e => `<option value="${e.name}">${e.name}</option>`).join('')}</select></div>
        <div class="form-group"><label for="schedule-date">Schedule Date</label><input type="date" id="schedule-date" required></div>
    `, 'Create Job', 'job');
    
    const getElectricianForm = () => getFormHTML('Add New Electrician', `
        <div class="form-group"><label for="name">Full Name</label><input type="text" id="name" required></div>
        <div class="form-group"><label for="phone">Phone</label><input type="tel" id="phone" required></div>
        <div class="form-group"><label for="email">Email</label><input type="email" id="email" required></div>
    `, 'Add Electrician', 'electrician');
    
    const getQuoteForm = () => getFormHTML('Create New Quote', `
        <div class="form-group"><label for="customer">Customer</label><select id="customer" required>${data.customers.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label for="amount">Amount</label><input type="number" id="amount" step="0.01" required></div>
        <div class="form-group"><label for="expires">Expiry Date</label><input type="date" id="expires" required></div>
    `, 'Create Quote', 'quote');
    
    const getInvoiceForm = () => getFormHTML('Create New Invoice', `
        <div class="form-group"><label for="customer">Customer</label><select id="customer" required>${data.customers.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label for="amount">Amount</label><input type="number" id="amount" step="0.01" required></div>
        <div class="form-group"><label for="due-date">Due Date</label><input type="date" id="due-date" required></div>
    `, 'Create Invoice', 'invoice');
    
    const getPaymentForm = () => getFormHTML('Record a Payment', `
        <div class="form-group"><label for="invoice">Invoice #</label><select id="invoice" required>${data.invoices.filter(i => i.status !== 'Paid').map(i => `<option value="${i.id}">${i.id} - ${i.customer}</option>`).join('')}</select></div>
        <div class="form-group"><label for="amount">Amount Paid</label><input type="number" id="amount" step="0.01" required></div>
        <div class="form-group"><label for="method">Payment Method</label><select id="method" required><option>Credit Card</option><option>Bank Transfer</option><option>Cash</option><option>Check</option></select></div>
        <div class="form-group"><label for="date">Payment Date</label><input type="date" id="date" value="${new Date().toISOString().split('T')[0]}" required></div>
    `, 'Record Payment', 'payment');
    
    const buttonActionMap = {
        'new-customer-btn': getCustomerForm,
        'add-customer-btn': getCustomerForm,
        'new-job-btn': getJobForm,
        'add-job-btn': getJobForm,
        'add-electrician-btn': getElectricianForm,
        'new-quote-btn': getQuoteForm,
        'add-quote-btn': getQuoteForm,
        'new-invoice-btn': getInvoiceForm,
        'add-invoice-btn': getInvoiceForm,
        'record-payment-btn': getPaymentForm,
    };

    for (const [id, formFunction] of Object.entries(buttonActionMap)) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => openModal(formFunction()));
        }
    }
    
    document.querySelectorAll('.report-generate-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Generating report... (This is a demo)');
        });
    });

    modal.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const formType = form.dataset.formType;
        if (!formType) return;

        try {
            switch (formType) {
                case 'customer': {
                    const newCustomer = {
                        id: `CUST-${Date.now()}`,
                        name: form.querySelector('#name').value,
                        phone: form.querySelector('#phone').value,
                        email: form.querySelector('#email').value,
                        address: form.querySelector('#address').value,
                        jobs: 0
                    };
                    data.customers.push(newCustomer);
                    break;
                }
                case 'job': {
                    const customerName = form.querySelector('#customer').value;
                    const newJob = {
                        id: `JOB-${Date.now()}`,
                        customer: customerName,
                        address: form.querySelector('#address').value,
                        technician: form.querySelector('#technician').value,
                        scheduled: form.querySelector('#schedule-date').value,
                        status: 'Scheduled'
                    };
                    data.jobs.push(newJob);
                    const customer = data.customers.find(c => c.name === customerName);
                    if (customer) customer.jobs++;
                    break;
                }
                case 'electrician': {
                    const newElectrician = {
                        id: `ELEC-${Date.now()}`,
                        name: form.querySelector('#name').value,
                        phone: form.querySelector('#phone').value,
                        email: form.querySelector('#email').value,
                        status: 'Available',
                        currentJob: '-'
                    };
                    data.electricians.push(newElectrician);
                    break;
                }
                case 'quote': {
                    const newQuote = {
                        id: `QT-${Date.now()}`,
                        customer: form.querySelector('#customer').value,
                        amount: parseFloat(form.querySelector('#amount').value),
                        created: new Date().toISOString().split('T')[0],
                        expires: form.querySelector('#expires').value,
                        status: 'Pending'
                    };
                    data.quotes.push(newQuote);
                    break;
                }
                case 'invoice': {
                    const amount = parseFloat(form.querySelector('#amount').value);
                    const newInvoice = {
                        id: `INV-${Date.now()}`,
                        customer: form.querySelector('#customer').value,
                        amount: amount,
                        dueDate: form.querySelector('#due-date').value,
                        status: 'Unpaid',
                        balance: amount
                    };
                    data.invoices.push(newInvoice);
                    break;
                }
                case 'payment': {
                    const invoiceId = form.querySelector('#invoice').value;
                    const amountPaid = parseFloat(form.querySelector('#amount').value);
                    const invoice = data.invoices.find(i => i.id === invoiceId);

                    if (!invoice) {
                        alert('Error: Invoice not found!');
                        return;
                    }

                    const newPayment = {
                        id: `PAY-${Date.now()}`,
                        invoice: invoiceId,
                        customer: invoice.customer,
                        amount: amountPaid,
                        method: form.querySelector('#method').value,
                        date: form.querySelector('#date').value,
                        receivedBy: 'Admin User'
                    };
                    data.payments.push(newPayment);

                    invoice.balance -= amountPaid;
                    if (invoice.balance <= 0) {
                        invoice.balance = 0;
                        invoice.status = 'Paid';
                    } else {
                        invoice.status = 'Partially Paid';
                    }
                    break;
                }
            }
            
            saveData();
            renderAllTables();
            closeModal();
        } catch(err) {
            console.error("Error processing form:", err);
            alert("An error occurred while submitting the form. Please check the console for details.");
        }
    });

    renderAllTables();
});
