// ✅ Consolidated Verita Campus Enrollment + Email Sending Script
// using Resend, Supabase JS Client, and automated cohort scheduling

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
const supabaseURL = 'https://bxjmzrxodoplxnuccrci.supabase.co'
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4am16cnhvZG9wbHhudWNjcmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMjU5ODQsImV4cCI6MjA2ODgwMTk4NH0.fZTRY9DeTs8DhV-2aShPenugtDUG0woMaKu5XF9BySE';
const resendAPI='R38Bz3zS_D17YJftVuMepKwtEDZMA62wA';
const resend = new Resend(process.env.resendAPI || resendAPI);
const supabase = createClient(supabaseURL,supabaseKey);

// Helper to add weeks to date
function addWeeks(date, weeks) {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result;
}

function getNextCohortDates(courseStartDate, durationWeeks) {
    const today = new Date();
    const currentStart = new Date(courseStartDate);
    const currentEnd = addWeeks(currentStart, durationWeeks);

    if (today < currentEnd) {
        const nextStart = new Date(currentEnd);
        nextStart.setDate(nextStart.getDate() + 1);
        const nextEnd = addWeeks(nextStart, durationWeeks);
        return { startDate: nextStart, endDate: nextEnd };
    } else {
        return { startDate: currentStart, endDate: currentEnd };
    }
}

export default async (req, res) => {
    try {
        const { studentData, courseCode } = req.body;

        // Fetch course data
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('course_code', courseCode)
            .single();

        if (courseError || !course) {
            return res.status(400).json({ error: 'Course not found.' });
        }

        const durationWeeks = parseInt(course.duration.split(' ')[0]);
        const { startDate, endDate } = getNextCohortDates(course.start_date, durationWeeks);

        // Insert student
        const { data: student, error: studentError } = await supabase
            .from('students')
            .insert(studentData)
            .select()
            .single();

        if (studentError) {
            return res.status(400).json({ error: 'Failed to insert student.' });
        }

        // Insert enrollment
        const { data: enrollment, error: enrollmentError } = await supabase
            .from('enrollments')
            .insert({
                student_id: student.student_id,
                course_id: course.course_id,
                payment_status: 'active',
                payment_date: new Date().toISOString(),
                cohort_start_date: startDate.toISOString(),
                cohort_end_date: endDate.toISOString(),
                
 
  amount_paid: studentData.amount_paid,
  currency: studentData.currency,
  payment_reference: studentData.payment_reference,
  cohort_start_date: startDate.toISOString(),
  cohort_end_date: endDate.toISOString(),
  whatsapp_link: whatsappLink
            })
            .select()
            .single();

        if (enrollmentError) {
            return res.status(400).json({ error: 'Failed to insert enrollment.' });
        }

        // Send Welcome Email
        const { error: emailError } = await resend.emails.send({
  from: 'Verita Campus <veritalearning@gmail.com>',
  to: student.email,
  subject: 'Welcome to Verita Campus - Enrollment Confirmed',
  html: `
    <div style="text-align:center;">
      <img src="https://veritacampus.com/logo.png" alt="Verita Campus Logo" style="max-width:150px; margin-bottom:20px;">
    </div>
    <img src="${student.photo_url}" alt="Student Photo" style="max-width:150px; border-radius:50%; margin-bottom:20px;">
  </div>
    <p>Hello ${student.first_name},</p>
    <p>🎉 You are enrolled in <strong>${course.course_name}</strong>!</p>
    <ul>
      <li>📅 <strong>Start Date:</strong> ${startDate.toDateString()}</li>
      <li>📅 <strong>End Date:</strong> ${endDate.toDateString()}</li>
      <li>⏳ <strong>Duration:</strong> ${course.duration}</li>
      <li>📞 <strong>Phone:</strong> ${student.phone}</li>
      <li>🏫 <strong>School Email:</strong> info@veritacampus.com</li>
      <li>📌 <strong>WhatsApp Group:</strong> <a href="${course.whatsapp_group_link}">${course.whatsapp_group_link}</a></li>
    </ul>
    <p>Contact <a href="mailto:support@veritacampus.com">support@veritacampus.com</a> if you need changes.</p>
    <p>Welcome to your learning journey with Verita Campus!</p>
    <div style="text-align:center; margin-top:30px;">
      <img src="https://veritacampus.com/welcome-banner.png" alt="Welcome to Verita Campus" style="max-width:100%; border-radius:8px;">
    </div>
  `
});

        if (emailError) {
            return res.status(400).json({ error: 'Failed to send welcome email.' });
        }

        return res.status(200).json({ message: 'Enrollment completed and email sent.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

const { studentData, courseCode } = req.body;

// fetch course details
const { data: course } = await supabase
  .from('courses')
  .select('*')
  .eq('course_code', courseCode)
  .single();

const durationWeeks = parseInt(course.duration);
const today = new Date();
const cohortStart = new Date(course.start_date);
const cohortEnd = addWeeks(cohortStart, durationWeeks);

// logic to determine cohort
let isCurrent = today < cohortEnd;
let startDate = isCurrent ? cohortStart : addWeeks(cohortEnd, 1);
let endDate = addWeeks(startDate, durationWeeks);
let whatsappLink = isCurrent ? course.whatsapp_group_link : course.next_whatsapp_group_link;

// generate student email
const studentEmail = `${studentData.first_name}.${studentData.last_name}@students.veritacampus.com`.toLowerCase();

// insert into students table
const { data: student } = await supabase.from('students').insert({
  ...studentData,
  photo_url: studentData.photo_url,
  student_email: studentEmail,
  currency: studentData.currency,
}).select().single();

// insert into enrollments
await supabase.from('enrollments').insert({
  student_id: student.student_id,
  course_id: course.course_id,
  payment_status: 'active',
  amount_paid: studentData.amount_paid,
  currency: studentData.currency,
  payment_reference: studentData.payment_reference,
  cohort_start_date: startDate.toISOString(),
  cohort_end_date: endDate.toISOString(),
  whatsapp_link: whatsappLink
});
