  const companySelect = document.getElementById("company-select");

fieldFlowCompanies.forEach(company => {
  const option = document.createElement("option");
  option.value = company.customer_id;
  option.textContent = company.business_name;
  companySelect.appendChild(option);
});

companySelect.addEventListener("change", async () => {
  const selectedCustomerId = companySelect.value;
  const selectedCompany = fieldFlowCompanies.find(
  company => company.customer_id === selectedCustomerId
);

document.getElementById("company-data-note").textContent =
  selectedCompany ?
  `Showing available job activity for ${selectedCompany.business_name}. Detailed company metrics will populate when full analytics data is available.` :
  "Detailed company metrics will populate when full analytics data is available.";
  const fullFieldFlowJobs = await loadFieldFlowJobsFromWorkbook();
const companyJobs = selectedCustomerId ?
  fullFieldFlowJobs.filter(job => job.customer_id === selectedCustomerId) :
  fullFieldFlowJobs;
  const workOrderDetailsBody = document.getElementById("work-order-details-body");

workOrderDetailsBody.innerHTML = "";

if (companyJobs.length > 0) {
  companyJobs.forEach(job => {
    const row = document.createElement("tr");
    
    const values = [
      job.work_order_number || job.job_id || "N/A",
      job.technician_name || "N/A",
      job.invoice_status || "N/A",
      job.customer_rating ?? "N/A",
      job.follow_up_date || "N/A",
      job.follow_up_notes || "N/A"
    ];
    
    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    
    workOrderDetailsBody.appendChild(row);
  });
} else {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  
  cell.colSpan = 6;
  cell.textContent = "No work order details available for this company.";
  
  row.appendChild(cell);
  workOrderDetailsBody.appendChild(row);
}
  const datedCompanyJobs = companyJobs
  .filter(job => job.job_date)
  .map(job => ({
    ...job,
    parsedJobDate: new Date(job.job_date + "T00:00:00")
  }));

const latestJobDate =
  datedCompanyJobs.length > 0 ?
  new Date(
    Math.max(
      ...datedCompanyJobs.map(job => job.parsedJobDate.getTime())
    )
  ) :
  null;
  
  const weekSelect = document.getElementById("week-select");
const selectedWeek = weekSelect.value;
weekSelect.innerHTML = '<option value="">Latest week</option>';

const availableWeeks = [
  ...new Set(
    datedCompanyJobs.map(job => {
      const d = new Date(job.parsedJobDate);
      const day = d.getDay();
      const daysToMonday = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + daysToMonday);
      return d.toISOString().slice(0, 10);
    })
  )
].sort().reverse();

availableWeeks.forEach(week => {
  const option = document.createElement("option");
  option.value = week;
  option.textContent = `Week of ${new Date(
    week + "T00:00:00"
  ).toLocaleDateString()}`;
  weekSelect.appendChild(option);
});

weekSelect.value = selectedWeek;
const weekStart = selectedWeek ?
  new Date(selectedWeek + "T00:00:00") :
  latestJobDate ?
  new Date(latestJobDate) :
  null;

if (weekStart) {
  const day = weekStart.getDay();
  const daysToMonday = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + daysToMonday);
}

const weekEnd = weekStart ? new Date(weekStart) : null;

if (weekEnd) {
  weekEnd.setDate(weekStart.getDate() + 6);
}
const weeklyJobs =
  weekStart && weekEnd ?
  datedCompanyJobs.filter(
    job =>
    job.parsedJobDate >= weekStart &&
    job.parsedJobDate <= weekEnd
  ) :
  [];

document.getElementById("week-range").textContent =
  weekStart && weekEnd ?
  `Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}` :
  "No dated work orders available for this company.";
const matchingJobs = selectedWeek ?
  weeklyJobs :
  selectedCustomerId ?
  fullFieldFlowJobs.filter(job => job.customer_id === selectedCustomerId) :
  fullFieldFlowJobs;
  
    const jobTypeCounts = matchingJobs.reduce((counts, job) => {
  counts[job.job_type] = (counts[job.job_type] || 0) + 1;
  return counts;
}, {});

const jobTypeBreakdown =
  matchingJobs.length > 0 ?
  Object.entries(jobTypeCounts)
  .map(([jobType, count]) => `${jobType} — ${count}`)
  .join(" • ") :
  "No job type data available for this company yet.";

document.getElementById("job-type-breakdown").textContent = jobTypeBreakdown;
  document.getElementById("total-work-orders").textContent = matchingJobs.length;
  const completedJobs = matchingJobs.filter(
  job => job.status === "completed"
).length;

document.getElementById("completed-work-orders").textContent = completedJobs;
const scheduledJobs = matchingJobs.filter(
  job => job.status === "scheduled"
).length;

document.getElementById("scheduled-jobs").textContent = scheduledJobs;
const canceledJobs = matchingJobs.filter(
  job => job.status === "canceled"
).length;

document.getElementById("canceled-jobs").textContent = canceledJobs;
  document.getElementById("fieldflow-jobs").textContent =
    matchingJobs.length > 0 ?
    matchingJobs
    .map(job => `${job.job_date} | ${job.job_type} | ${job.status.toUpperCase()}`)
    .join("\n") :
    "No job activity available for this company yet.";
const jobCompletionRate =
  matchingJobs.length > 0 ?
  (completedJobs / matchingJobs.length) * 100 :
  0;

document.getElementById("completion-rate").textContent =
  jobCompletionRate.toFixed(1) + "%";
const canceledRate =
  matchingJobs.length > 0 ?
  (canceledJobs / matchingJobs.length) * 100 :
  0;
  document.getElementById("canceled-rate").textContent = canceledRate.toFixed(1) + "%";
  const totalLaborHours = matchingJobs.reduce(
  (sum, job) => sum + (Number(job.labor_hours) || 0),
  0
);

document.getElementById("total-labor-hours").textContent =
  matchingJobs.some(job => job.labor_hours !== undefined) ?
  totalLaborHours.toFixed(2) :
  "N/A";
const totalEstimatedCost = matchingJobs.reduce(
  (sum, job) => sum + (Number(job.estimated_cost) || 0),
  0
);

document.getElementById("total-estimated-cost").textContent =
  matchingJobs.some(job => job.estimated_cost !== undefined) ?
  "$" + totalEstimatedCost.toFixed(2) :
  "N/A";
const totalActualCost = matchingJobs.reduce(
  (sum, job) => sum + (Number(job.actual_cost) || 0),
  0
);

document.getElementById("total-actual-cost").textContent =
  matchingJobs.some(job => job.actual_cost !== undefined && job.actual_cost !== null) ?
  "$" + totalActualCost.toFixed(2) :
  "N/A";
const costVariance = totalEstimatedCost - totalActualCost;

document.getElementById("cost-variance").textContent =
  matchingJobs.some(job => job.estimated_cost !== undefined && job.actual_cost !== undefined) ?
  "$" + costVariance.toFixed(2) :
  "N/A";
const routinePriorityWorkOrders = matchingJobs.filter(
  job => job.priority === "routine"
).length;

document.getElementById("routine-priority-work-orders").textContent =
  routinePriorityWorkOrders;
const completedJobsForCost = matchingJobs.filter(
  job => job.status === "completed" && job.actual_cost !== undefined
);

const averageCostPerWorkOrder =
  completedJobsForCost.length > 0 ?
  completedJobsForCost.reduce(
    (sum, job) => sum + (Number(job.actual_cost) || 0),
    0
  ) / completedJobsForCost.length :
  null;

document.getElementById("average-cost-per-work-order").textContent =
  averageCostPerWorkOrder !== null ?
  "$" + averageCostPerWorkOrder.toFixed(2) :
  "N/A";
const completedJobsForLabor = matchingJobs.filter(
  job => job.status === "completed" && job.labor_hours !== undefined
);

const averageLaborHours =
  completedJobsForLabor.length > 0 ?
  completedJobsForLabor.reduce(
    (sum, job) => sum + (Number(job.labor_hours) || 0),
    0
  ) / completedJobsForLabor.length :
  null;

document.getElementById("average-labor-hours").textContent =
  averageLaborHours !== null ?
  averageLaborHours.toFixed(2) :
  "N/A";
const totalDue = matchingJobs.reduce(
  (sum, job) => sum + (Number(job.total_due) || 0),
  0
);

document.getElementById("total-due").textContent =
  matchingJobs.some(job => job.total_due !== undefined) ?
  "$" + totalDue.toFixed(2) :
  "N/A";
const totalCollected = matchingJobs.reduce(
  (sum, job) => sum + (Number(job.total_paid_to_date) || 0),
  0
);

document.getElementById("total-collected").textContent =
  matchingJobs.some(job => job.total_paid_to_date !== undefined) ?
  "$" + totalCollected.toFixed(2) :
  "N/A";
document.getElementById("outstanding-balance").textContent =
  matchingJobs.some(job => job.total_due !== undefined && job.total_paid_to_date !== undefined) ?
  "$" + (totalDue - totalCollected).toFixed(2) :
  "N/A";
const uniqueClients = [
  ...new Set(
    matchingJobs
    .map(job => job.client_name)
    .filter(name => name)
  )
];

document.getElementById("client-activity").textContent =
  uniqueClients.length > 0 ?
  `${uniqueClients.length} unique clients` :
  "No client activity available for this company.";
  
});
document.getElementById("week-select").addEventListener("change", () => {
  companySelect.dispatchEvent(new Event("change"));
});