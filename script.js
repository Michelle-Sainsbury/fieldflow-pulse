const fieldFlowData = [
  {
    FieldFlow_Code: "PE1001",
    Company_Name: "Powerteam Electric",
    Customer_Name: "Alice Adams",
    Project_Name: "Rewire Kitchen",
  Client_Type: "New",
  Project_Stage: "contract sign",
 Completion_Percentage: 0,
  Week_Start_Date: "2026-08-17"
  },
  {
    FieldFlow_Code: "PE1001",
    Company_Name: "Powerteam Electric",
    Customer_Name: "Bob Brown",
    Project_Name: "Panel Upgrade",
  Client_Type: "Returning",
  Project_Stage: "work in progress",
  Completion_Percentage: 0.5,
  Week_Start_Date: "2026-08-17"
  },
  {
    FieldFlow_Code: "PE1001",
    Company_Name: "Powerteam Electric",
    Customer_Name: "Carol Clark",
    Project_Name: "Lighting Installation",
  Client_Type: "New",
  Project_Stage: "design stages indicated",
 Completion_Percentage: 0.1,
  Week_Start_Date: "2026-08-17"
  }
];
const confirmedFieldFlowData = [
  {
    work_order_number: "WO-2026-00001",
    job_date: "2026-04-15",
    status: "completed",
    priority: "routine",
    labor_hours: 3.05,
    estimated_cost: 92.81,
    actual_cost: 84.57,
    technician_name: "Tariq Silva",
   invoice_status: "paid",
  total_due: 91.76,
  total_paid_to_date: 91.76 
  },
  {
    work_order_number: "WO-2026-00002",
    job_date: "2026-05-27",
    status: "completed",
    priority: "routine",
    labor_hours: 4.21,
    estimated_cost: 567.35,
    actual_cost: 573.21,
    technician_name: "Tariq Silva",
  invoice_status: "paid",
  total_due: 621.93,
  total_paid_to_date: 621.93
  },
  {
    work_order_number: "WO-2026-00006",
    job_date: "2026-02-14",
    status: "canceled",
    priority: "routine",
    labor_hours: 3.66,
    estimated_cost: 467.37,
    actual_cost: 0,
    technician_name: "Tariq Silva",
  invoice_status: "not_invoiced",
  total_due: 0,
  total_paid_to_date: 0
  }
];
const totalWorkOrders = confirmedFieldFlowData.length;

const totalLaborHours = confirmedFieldFlowData.reduce(
  (total, record) => total + record.labor_hours,
  0
);
const totalEstimatedCost = confirmedFieldFlowData.reduce(
  (total, record) => total + record.estimated_cost,
  0
);
const totalActualCost = confirmedFieldFlowData.reduce(
  (total, record) => total + record.actual_cost,
  0
);
const totalDue = confirmedFieldFlowData.reduce(
  (total, record) => total + record.total_due,
  0
);

const totalCollected = confirmedFieldFlowData.reduce(
  (total, record) => total + record.total_paid_to_date,
  0
);

const outstandingBalance = totalDue - totalCollected;
const costVariance = totalEstimatedCost - totalActualCost;
const averageCostPerWorkOrder =
  totalWorkOrders > 0 ? totalActualCost / totalWorkOrders : 0;
  const averageLaborHours =
  totalWorkOrders > 0 ? totalLaborHours / totalWorkOrders : 0;
  const routinePriorityWorkOrders = confirmedFieldFlowData.filter(
  record => record.priority === "routine"
).length;
  const completedWorkOrders = confirmedFieldFlowData.filter(
  record => record.status === "completed"
).length;
const completionRate = (completedWorkOrders / totalWorkOrders) * 100;
document.getElementById("completed-work-orders").textContent =
  completedWorkOrders;


const workOrderStatuses = confirmedFieldFlowData
  .map(record => record.status)
  .join(" • ");

document.getElementById("work-order-status").textContent = workOrderStatuses;

document.getElementById("total-work-orders").textContent = totalWorkOrders;
document.getElementById("total-labor-hours").textContent = totalLaborHours.toFixed(2);
document.getElementById("total-estimated-cost").textContent = "$" + totalEstimatedCost.toFixed(2);
document.getElementById("routine-priority-work-orders").textContent = routinePriorityWorkOrders;
document.getElementById("total-actual-cost").textContent = "$" + totalActualCost.toFixed(2);
document.getElementById("total-due").textContent =
  "$" + totalDue.toFixed(2);

document.getElementById("total-collected").textContent =
  "$" + totalCollected.toFixed(2);

document.getElementById("outstanding-balance").textContent =
  "$" + outstandingBalance.toFixed(2);
document.getElementById("average-cost-per-work-order").textContent =
  "$" + averageCostPerWorkOrder.toFixed(2);
  document.getElementById("average-labor-hours").textContent =
  averageLaborHours.toFixed(2);
document.getElementById("cost-variance").textContent = "$" + costVariance.toFixed(2);
document.getElementById("completion-rate").textContent = completionRate.toFixed(1) + "%";
const reportingWeek = confirmedFieldFlowData[0].job_date;

document.getElementById("reporting-week").textContent =
  "Reference Job Date: " + reportingWeek;
  const weeklySchedule = confirmedFieldFlowData
  .map(record => record.work_order_number + " — " + record.status)
  .join(" • ");

document.getElementById("weekly-schedule").textContent = weeklySchedule;

document.getElementById("fieldflow-jobs").textContent =
  fieldFlowJobs
  .map(job => `${job.job_date} | ${job.job_type} | ${job.status.toUpperCase()}`)
  .join("\n");
  
  const companySelect = document.getElementById("company-select");

fieldFlowCompanies.forEach(company => {
  const option = document.createElement("option");
  option.value = company.customer_id;
  option.textContent = company.business_name;
  companySelect.appendChild(option);
});

companySelect.addEventListener("change", () => {
  const selectedCustomerId = companySelect.value;
  
  const matchingJobs = selectedCustomerId ?
    fieldFlowJobs.filter(job => job.customer_id === selectedCustomerId) :
    fieldFlowJobs;
  
  document.getElementById("fieldflow-jobs").textContent =
    matchingJobs.length > 0 ?
    matchingJobs
    .map(job => `${job.job_date} | ${job.job_type} | ${job.status.toUpperCase()}`)
    .join("\n") :
    "No job activity available for this company yet.";
});