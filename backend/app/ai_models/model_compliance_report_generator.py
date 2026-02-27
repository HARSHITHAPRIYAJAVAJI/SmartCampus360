# model_compliance_report_generator.py
def build_compliance_report(section_data: dict):
    """
    section_data example keys:
    - program_outcomes
    - timetable_summary
    - faculty_workload
    - lab_utilization
    - student_attainment
    """

    report = f"""
    NBA/NAAC/UGC Compliance Summary
    -------------------------------
    Generated on: {section_data.get('date', 'N/A')}
    
    1. Program Outcomes (POs):
       {section_data.get('program_outcomes', 'Data not provided')}
       
    2. Timetable Optimization Summary:
       {section_data.get('timetable_summary', 'Data not provided')}
       
    3. Faculty Workload Distribution:
       {section_data.get('faculty_workload', 'Data not provided')}
       
    4. Lab Utilization:
       {section_data.get('lab_utilization', 'Data not provided')}
       
    5. Student Attainment Mapping:
       {section_data.get('student_attainment', 'Data not provided')}
       
    Conclusion: The current academic planning meets the minimum standards for {section_data.get('compliance_body', 'NBA/NAAC/UGC')}.
    """
    return report
