-- ==============================================================================
-- CampusOS Studio - Automated Data Seed Script
-- Generated at: 2026-09-24T18:30:13.472Z
-- Org: usted-ksi
-- ==============================================================================

-- 1. Insert Buildings
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('1', 'usted-ksi', 'LIBRARY', 'USTED Library', 'Library', 'academic', 6.698007, -1.681834, NULL, 'Main campus library with reading rooms, digital resources and WiFi access.', '7:00 AM – 10:00 PM', '[{"name":"Library Services","description":"Access to books, digital resources, and study spaces","requirements":"Student ID card","hours":"7:00 AM – 10:00 PM","keywords":["LIBRARY LIBRARY SERVICES"]}]'::jsonb, '{"source_id":1}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('2', 'usted-ksi', 'CLINIC', 'The Clinic', 'Clinic', 'facility', 6.69738, -1.6797, NULL, 'Campus health facility offering primary care, first aid and pharmacy services.', '7:00 AM – 10:00 PM', '[{"name":"Medical Services","description":"Primary healthcare, first aid, and pharmacy","requirements":"Student ID or valid identification","hours":"7:00 AM – 10:00 PM","keywords":["CLINIC MEDICAL SERVICES"]}]'::jsonb, '{"source_id":2}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('3', 'usted-ksi', 'ATWIMA HALL', 'Atwima Hall', 'Atwima Hall', 'hostel', 6.696882689029287, -1.6795104715259046, NULL, 'Student residential hall with study rooms and recreational facilities.', '24 hours', '[]'::jsonb, '{"source_id":3}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('4', 'usted-ksi', 'UBS', 'UBS', 'UBS', 'facility', 6.6968720333951754, -1.676838991370415, NULL, 'University Banking Services on campus for student and staff financial transactions.', '8:30 AM – 4:30 PM', '[{"name":"Banking Services","description":"Account management, loans, and financial transactions","requirements":"Valid ID and account details","hours":"8:30 AM – 4:30 PM","keywords":["UBS BANKING SERVICES"]}]'::jsonb, '{"source_id":4}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('5', 'usted-ksi', 'AUDITORIUM', 'New Auditorium', 'Auditorium', 'academic', 6.697999, -1.679975, NULL, 'Large campus auditorium for convocations, events and large gatherings.', 'By schedule', '[]'::jsonb, '{"source_id":5}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('6', 'usted-ksi', 'MOSQUE', 'Opoku Ware Mosque', 'Mosque', 'facility', 6.697788, -1.683953, NULL, 'Campus mosque for Islamic worship and community activities.', 'Open for prayer times', '[]'::jsonb, '{"source_id":6}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('7', 'usted-ksi', 'NEW LIBRARY', 'New Library', 'New Library', 'academic', 6.700420346407515, -1.6812914582753884, NULL, 'Newly built library facility with expanded study spaces, digital resources and research support.', '7:00 AM – 10:00 PM', '[{"name":"Library Services","description":"Expanded library with digital and physical resources","requirements":"Student ID card","hours":"7:00 AM – 10:00 PM","keywords":["NEW LIBRARY LIBRARY SERVICES"]}]'::jsonb, '{"source_id":7}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('8', 'usted-ksi', 'MECH. WORKSHOP', 'Mechanical Workshop', 'Mech. Workshop', 'academic', 6.700207235247202, -1.6795533868562482, NULL, 'Workshop facility for mechanical engineering practical sessions and projects.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":8}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('9', 'usted-ksi', 'FOOTBALL FIELD', 'AAMUSTED Football Field', 'Football Field', 'facility', 6.701221, -1.678382, NULL, 'Main campus football field (soccer park) for sports events, training and recreational activities.', '6:00 AM – 8:00 PM', '[]'::jsonb, '{"source_id":9}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('10', 'usted-ksi', 'MANAGEMENT DEPT.', 'Department of Management', 'Management Dept.', 'academic', 6.700835912907712, -1.6822355958550224, NULL, 'Department handling management and business-related academic programmes.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":10}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('11', 'usted-ksi', 'OW HALL', 'Opoku Ware Hall', 'OW Hall', 'hostel', 6.69784309227766, -1.682883903599286, NULL, 'Student residential hall with study rooms and recreational facilities.', '24 hours', '[]'::jsonb, '{"source_id":11}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('12', 'usted-ksi', 'TL BLOCK', 'T.L. Block', 'TL Block', 'academic', 6.697532, -1.681563, NULL, 'Teaching and Learning Block housing lecture halls and tutorial rooms.', '7:00 AM – 6:00 PM', '[]'::jsonb, '{"source_id":12}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('13', 'usted-ksi', 'FTE', 'Faculty of Technical Education', 'FTE', 'faculty', 6.698387, -1.68002, NULL, 'Faculty offering mechanical, electrical, automotive and construction technology programmes.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":13}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('14', 'usted-ksi', 'CATERING LAB', 'Catering and Hospitality Lab', 'Catering Lab', 'academic', 6.700230295041086, -1.6805827904715855, NULL, 'Laboratory and training facility for catering, hospitality and food service programmes.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":14}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('15', 'usted-ksi', 'FASHION LAB', 'Fashion and Textiles Lab', 'Fashion Lab', 'academic', 6.700211615966025, -1.6803445617984518, NULL, 'Laboratory for fashion design, textiles and clothing technology programmes.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":15}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('16', 'usted-ksi', 'MECH. ANNEX', 'Mechanical Workshop (Annex)', 'Mech. Annex', 'academic', 6.700329916761255, -1.6796612216432647, NULL, 'Additional mechanical workshop facility for technology and engineering practicals.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":16}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('17', 'usted-ksi', 'AUTO WORKSHOP', 'AAMUSTED Automotive Workshop', 'Auto Workshop', 'academic', 6.700101616952657, -1.6790740088612417, NULL, 'Automotive engineering workshop for vehicle maintenance, repair and hands-on training.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":17}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('18', 'usted-ksi', 'WOODLAB', 'Woodlab Workshop', 'Woodlab', 'academic', 6.700175380605054, -1.6781519814855566, NULL, 'Woodwork laboratory and workshop for construction technology and carpentry students.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":18}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('19', 'usted-ksi', 'MYND FM', 'MYND FM', 'MYND FM', 'facility', 6.700420458458023, -1.6766338511797239, NULL, 'Campus radio station broadcasting news, entertainment and educational content.', 'On-air hours vary', '[]'::jsonb, '{"source_id":19}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('20', 'usted-ksi', 'CHAPLAINCY', 'St. Williams Chaplaincy', 'Chaplaincy', 'facility', 6.701922889520137, -1.6769718095177195, NULL, 'Campus chaplaincy centre for Christian worship, counselling and spiritual activities.', 'By schedule', '[]'::jsonb, '{"source_id":20}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('21', 'usted-ksi', 'ESA', 'Executive Students Association (ESA) Lecture Block', 'ESA Block', 'academic', 6.701263320240392, -1.6831062195613589, '[-1.683106,6.702]'::jsonb, 'Lecture Block housing lecture auditoriums and faculty offices.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":21}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('22', 'usted-ksi', 'NFB', 'NFB', 'NFB', 'academic', 6.701497409024071, -1.6836742245585143, NULL, 'New Faculty Building with lecture halls, seminar rooms and department offices.', '7:00 AM – 6:00 PM', '[]'::jsonb, '{"source_id":22}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('23', 'usted-ksi', 'NLB', 'NLB', 'NLB', 'academic', 6.702039508930884, -1.6833389484263725, NULL, 'New Lecture Building providing modern lecture halls and academic spaces.', '7:00 AM – 6:00 PM', '[]'::jsonb, '{"source_id":23}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('24', 'usted-ksi', 'ECONOMICS DEPT.', 'Department of Economics Education', 'Economics Dept.', 'academic', 6.700396761583695, -1.6824193407928505, NULL, 'Department offering economics education and business studies programmes.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":24}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('25', 'usted-ksi', 'ROB', 'ROB Block', 'ROB', 'administration', 6.700458972619646, -1.6820753764509622, NULL, 'Reynolds Okine Building — Academic and administrative hub housing the Faculty of Business Education (FBE), Graduate School, and key student services.', '7:00 AM – 6:00 PM', '[{"name":"FBE Management Studies HOD Office","category":"Department Office","floor":"2nd Floor","room":"Room 039","description":"Head of Department Office for Management Studies Education","keywords":["HOD","MANAGEMENT HOD","ROB 039","ROB HOD","MANAGEMENT STUDIES HOD"]},{"name":"FBE Accounting Studies HOD Office","category":"Department Office","floor":"2nd Floor","room":"Room 040","description":"Head of Department Office for Accounting Studies Education","keywords":["HOD","ACCOUNTING HOD","ROB 040","ROB HOD","ACCOUNTING STUDIES HOD"]},{"name":"DEL HOD Office (Languages)","category":"Department Office","floor":"1st Floor","room":"Room 022","description":"Head of Department Office for Languages Education","keywords":["HOD","DEL","LANGUAGES HOD","ROB 022"]},{"name":"DIS HOD Office (Interdisciplinary)","category":"Department Office","floor":"1st Floor","room":"Room 023","description":"Head of Department Office for Interdisciplinary Studies","keywords":["HOD","DIS","INTERDISCIPLINARY HOD","ROB 023"]},{"name":"Accounting Exams Office","category":"Exams Office","floor":"2nd Floor","room":"Room 046","description":"Department of Accounting Examination Office","keywords":["ACCOUNTING EXAMS","EXAMS OFFICE","ROB 046"]},{"name":"Management Exams Office","category":"Exams Office","floor":"2nd Floor","room":"Room 047","description":"Department of Management Examination Office","keywords":["MANAGEMENT EXAMS","EXAMS OFFICE","ROB 047"]}]'::jsonb, '{"source_id":25}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('26', 'usted-ksi', 'ADMIN', 'Main Administration Block', 'Main Admin', 'administration', 6.696903, -1.681367, NULL, 'Main university administration building housing the Vice-Chancellor''s office, registry and key admin units.', '8:00 AM – 5:00 PM', '[{"name":"Cash Office","category":"Finance","floor":"Ground Floor","keywords":["ADMIN BLOCK GF","ADMISSION","ADMIN BLOCK CASH OFFICE","PAYMENT","FEES","FORMS"],"description":"Purchase of admission forms and related payments","hours":"8:00 AM – 4:00 PM"},{"name":"IT Consult","category":"Technical Support","floor":"First Floor","keywords":["LMS","TECHNICAL","STUDENT PORTAL","SUPPORT","PORTAL","ADMIN BLOCK IT CONSULT","ADMIN BLOCK FF"],"description":"Support for student portal and LMS issues","hours":"8:00 AM – 5:00 PM"},{"name":"Administration Services","category":"Administration","description":"General administration and inquiries","requirements":"Valid ID","hours":"8:00 AM – 5:00 PM","keywords":["ADMIN BLOCK ADMINISTRATION SERVICES"]}]'::jsonb, '{"source_id":26}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('27', 'usted-ksi', 'ICT LAB', 'ICT Lab', 'ICT Lab', 'academic', 6.697921, -1.68156, NULL, 'Computer and ICT laboratory providing computing resources, internet access and digital training for students.', '8:00 AM – 6:00 PM', '[]'::jsonb, '{"source_id":27}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('28', 'usted-ksi', 'FASME', 'FASME Block', 'FASME', 'faculty', 6.698066, -1.680635, NULL, 'Faculty of Applied Science and Mathematics Education — science, maths and ICT education programmes.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":28}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('29', 'usted-ksi', 'GRAD BLOCK', 'Graduate Block', 'Grad Block', 'academic', 6.697252, -1.680922, NULL, 'Building dedicated to postgraduate students and the graduate school administration.', '8:00 AM – 5:00 PM', '[]'::jsonb, '{"source_id":29}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('30', 'usted-ksi', 'ODSA', 'Dean''s Office (ODSA)', 'ODSA', 'administration', 6.697846, -1.681037, NULL, 'Office of the Dean of Student Affairs (ODSA) handling student welfare, discipline, accommodation, and campus life affairs.', '8:00 AM – 5:00 PM', '[{"name":"Student Affairs","description":"Student welfare, discipline, and campus services","requirements":"Student ID or appointment","hours":"8:00 AM – 5:00 PM","keywords":["DEAN''S OFFICE STUDENT AFFAIRS"]}]'::jsonb, '{"source_id":30}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('31', 'usted-ksi', 'CANTEEN', 'AAMUSTED Canteen', 'Canteen', 'facility', 6.698624, -1.683424, NULL, 'Main campus canteen providing affordable meals, snacks and refreshments for students and staff.', '7:00 AM – 8:00 PM', '[{"name":"Infotess Office","category":"Student Organization","floor":"Ground Floor","keywords":["ACTIVITIES","STUDENT ORGANIZATION","CANTEEN GF","INFOTESS","CANTEEN INFOTESS OFFICE"],"description":"Official office for INFOTESS activities","hours":"8:00 AM – 5:00 PM"},{"name":"Food Services","category":"Facility","description":"Meals, snacks, and refreshments","requirements":"Payment method","hours":"7:00 AM – 8:00 PM","keywords":["CANTEEN FOOD SERVICES"]}]'::jsonb, '{"source_id":31}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('32', 'usted-ksi', 'OW II HALL', 'Opoku Ware II Hall', 'OW II Hall', 'hostel', 6.69762, -1.68356, NULL, 'Second Opoku Ware residential hall with modern student accommodation and amenities.', '24 hours', '[]'::jsonb, '{"source_id":32}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('33', 'usted-ksi', 'SECURITY', 'Security Office', 'Security', 'administration', 6.69677, -1.682201, NULL, 'Campus security headquarters managing safety, access control and emergency response.', '24 hours', '[{"name":"Security Services","description":"Campus security and emergency response","requirements":"Valid ID for access","hours":"24 hours","keywords":["SECURITY SECURITY SERVICES"]}]'::jsonb, '{"source_id":33}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('34', 'usted-ksi', 'FOOD COURT', 'Food Court', 'Food Court', 'facility', 6.698691, -1.682611, NULL, 'Campus food court area with multiple food vendors offering diverse meal options for students and staff.', '7:00 AM – 9:00 PM', '[{"name":"Food Court Services","description":"Multiple food vendors and dining options","requirements":"Payment method","hours":"7:00 AM – 9:00 PM","keywords":["FOOD COURT FOOD COURT SERVICES"]}]'::jsonb, '{"source_id":34}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('36', 'usted-ksi', 'HANDBALL COURT', 'Handball Court', 'Handball Court', 'facility', 6.696693, -1.679889, NULL, 'Dedicated handball court for recreational sports and competitive campus games.', '6:00 AM – 8:00 PM', '[]'::jsonb, '{"source_id":36}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('37', 'usted-ksi', 'TRANSPORT', 'Transport Hub', 'Transport', 'facility', 6.69702, -1.680857, NULL, 'Campus transport and logistics hub for university vehicles, staff buses and student transport services.', '6:00 AM – 6:00 PM', '[{"name":"Transport Services","description":"Campus transport and logistics","requirements":"Valid transport pass or permission","hours":"6:00 AM – 6:00 PM","keywords":["TRANSPORT TRANSPORT SERVICES"]}]'::jsonb, '{"source_id":37}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('38', 'usted-ksi', 'CREDIT UNION', 'Credit Union', 'Credit Union', 'facility', 6.701576, -1.681984, NULL, 'Staff and student credit union offering savings, loans and financial support services on campus.', '8:00 AM – 4:30 PM', '[{"name":"Financial Services","description":"Savings, loans, and credit union services","requirements":"Membership and valid ID","hours":"8:00 AM – 4:30 PM","keywords":["CREDIT UNION FINANCIAL SERVICES"]}]'::jsonb, '{"source_id":38}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('39', 'usted-ksi', 'ESA PAVILION', 'ESA Pavilion', 'ESA Pavilion', 'facility', 6.701666, -1.682772, NULL, 'Outdoor pavilion near the ESA building used for campus events, gatherings and recreational activities.', 'Open access', '[]'::jsonb, '{"source_id":39}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('40', 'usted-ksi', 'VOLLEYBALL COURT', 'Volleyball Court', 'Volleyball Court', 'facility', 6.701751, -1.679033, NULL, 'Campus volleyball court for recreational play, inter-departmental tournaments and sports training.', '6:00 AM – 8:00 PM', '[]'::jsonb, '{"source_id":40}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('41', 'usted-ksi', 'BASKETBALL COURT', 'Basketball Court', 'Basketball Court', 'facility', 6.701757, -1.678843, NULL, 'Outdoor basketball court for recreational play and campus sports competitions.', '6:00 AM – 8:00 PM', '[]'::jsonb, '{"source_id":41}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('42', 'usted-ksi', 'AUTONOMY HALL', 'Autonomy Hall', 'Autonomy Hall', 'hostel', 6.700569, -1.677035, NULL, 'Modern student residential hall with accommodation, study areas and recreational amenities.', '24 hours', '[]'::jsonb, '{"source_id":42}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('43', 'usted-ksi', 'UBA', 'UBA', 'UBA', 'facility', 6.69734, -1.683376, NULL, 'United Bank for Africa (UBA) branch on campus offering banking services, ATM and mobile banking support.', '8:30 AM – 4:30 PM', '[{"name":"Banking Services","description":"Full banking services including ATM","requirements":"Valid ID for transactions","hours":"8:30 AM – 4:30 PM","keywords":["UBA BANKING SERVICES"]},{"name":"Fees Payment","description":"Tuition, hall fees and other university fee payments","requirements":"Fee statement and student ID","hours":"8:30 AM – 4:00 PM","keywords":["UBA FEES PAYMENT","SCHOOL FEES","HALL FEES","FEES PAYMENT","TUITION"]}]'::jsonb, '{"source_id":43}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('44', 'usted-ksi', 'FRANKY JAY MALL', 'Franky Jay Shopping Mall', 'Franky Jay Mall', 'facility', 6.698302, -1.682416, NULL, 'On-campus shopping mall with retail shops, phone accessories, stationery and everyday essentials.', '7:00 AM – 9:00 PM', '[]'::jsonb, '{"source_id":44}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('45', 'usted-ksi', 'TENNIS COURT', 'Opoku Ware Tennis Court', 'Tennis Court', 'facility', 6.697564, -1.683349, NULL, 'Tennis court adjacent to Opoku Ware Hall for recreational and competitive tennis play.', '6:00 AM – 8:00 PM', '[]'::jsonb, '{"source_id":45}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('46', 'usted-ksi', 'ATM', 'Campus ATM', 'ATM', 'facility', 6.697423, -1.682324, NULL, 'On-campus ATM for quick cash withdrawals. Supported banks include UBA, GCB, Fidelity and others.', '24 hours', '[{"name":"ATM Services","description":"Cash withdrawals and basic banking","requirements":"ATM card and PIN","hours":"24 hours","keywords":["ATM ATM SERVICES"]}]'::jsonb, '{"source_id":46}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('47', 'usted-ksi', 'NEW BLDG', 'New Building', 'New Bldg', 'academic', 6.698028, -1.680243, NULL, 'Newly constructed academic facility providing modern lecture halls and seminar rooms.', '7:00 AM – 6:00 PM', '[]'::jsonb, '{"source_id":47}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;
INSERT INTO buildings (id, org_id, code, name, short_name, type, lat, lng, entrance, description, hours, services, metadata)
VALUES ('35', 'usted-ksi', 'CBT', 'CBT Building', 'CBT', 'academic', 6.700221, -1.680463, NULL, 'Competency-Based Training Centre housing Faculty of Vocational Education departments including Fashion Design & Textiles Education and Hospitality & Tourism Education.', '7:00 AM – 8:00 PM', '[]'::jsonb, '{"source_id":35}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  type = EXCLUDED.type,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  entrance = EXCLUDED.entrance,
  description = EXCLUDED.description,
  hours = EXCLUDED.hours,
  services = EXCLUDED.services,
  metadata = EXCLUDED.metadata;

-- 2. Insert Rooms
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('1-101', 'usted-ksi', '1', '101', 0, 'Main reading room', '"LIBRARY 101","LIBRARY ROOM 101","LIBRARY GF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('1-102', 'usted-ksi', '1', '102', 0, 'Digital resources center', '"LIBRARY ROOM 102","LIBRARY 102","LIBRARY GF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('1-odsa-lib', 'usted-ksi', '1', 'odsa lib', 0, 'Staff Office – Prof. Dr. Philip Oti-Agyen (Department of Educational Leadership)', '"PROF. DR. PHILIP OTI-AGYEN","OTI-AGYEN","LIBRARY ODSA LIB","LIBRARY ROOM ODSA LIB","ROOM ODSA LIB","ODSA LIB","DEPARTMENT OF EDUCATIONAL LEADERSHIP","DEL","EDUCATIONAL LEADERSHIP","LIBRARY GF","GROUND FLOOR"'::TEXT[], NULL, '{"staff":["Prof. Dr. Philip Oti-Agyen"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('3-101', 'usted-ksi', '3', '101', 1, 'Study room', '"ATWIMA HALL ROOM 101","ATWIMA HALL 101","ATWIMA HALL FF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('5-main-hall', 'usted-ksi', '5', 'Main Hall', 0, 'Large auditorium space', '"AUDITORIUM MAIN HALL","AUDITORIUM GF","AUDITORIUM ROOM MAIN HALL"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('7-201', 'usted-ksi', '7', '201', 2, 'Research area', '"NEW LIBRARY ROOM 201","NEW LIBRARY 201","NEW LIBRARY SF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('7-301', 'usted-ksi', '7', '301', 3, 'Study hall', '"NEW LIBRARY TF","NEW LIBRARY ROOM 301","NEW LIBRARY 301"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('8-workshop-1', 'usted-ksi', '8', 'Workshop 1', 0, 'Main mechanical workshop', '"MECH. WORKSHOP GF","MECH. WORKSHOP ROOM WORKSHOP 1","MECH. WORKSHOP WORKSHOP 1"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('10-101', 'usted-ksi', '10', '101', 1, 'Lecture room', '"MANAGEMENT DEPT. 101","MANAGEMENT DEPT. FF","MANAGEMENT DEPT. ROOM 101"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('10-102', 'usted-ksi', '10', '102', 1, 'Seminar room', '"MANAGEMENT DEPT. ROOM 102","MANAGEMENT DEPT. FF","MANAGEMENT DEPT. 102"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('11-25', 'usted-ksi', '11', '25', 2, 'Standard student room', '"OW HALL 25","OW HALL SF","OW HALL ROOM 25"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('12-lt1', 'usted-ksi', '12', 'LT1', 0, 'Lecture theatre 1', '"TL BLOCK ROOM 1","TL BLOCK 1","TL BLOCK GF","TL BLOCK ROOM LT1","TL BLOCK LT1"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('12-lt2', 'usted-ksi', '12', 'LT2', 1, 'Lecture theatre 2', '"TL BLOCK LT2","TL BLOCK ROOM 2","TL BLOCK 2","TL BLOCK FF","TL BLOCK ROOM LT2"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('13-201', 'usted-ksi', '13', '201', 2, 'Faculty office', '"FTE 201","FTE ROOM 201","FTE SF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('13-02', 'usted-ksi', '13', '02', 0, 'Staff Office – Associate Professor Dr. Engr. Kwaku Antwi (Department of Civil Engineering)', '"ASSOCIATE PROFESSOR DR. ENGR. KWAKU ANTWI","ANTWI","FTE 02","FTE ROOM 02","ROOM 02","02","DEPARTMENT OF CIVIL ENGINEERING","CIVIL ENGINEERING"'::TEXT[], NULL, '{"staff":["Associate Professor Dr. Engr. Kwaku Antwi"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('13-09', 'usted-ksi', '13', '09', 0, 'Staff Office – Dr. Fredrick Simpeh (Department of Construction and Wood Technology Education)', '"DR. FREDRICK SIMPEH","SIMPEH","FTE 09","FTE ROOM 09","ROOM 09","09","DEPARTMENT OF CONSTRUCTION AND WOOD TECHNOLOGY EDUCATION","DCWTE","CONSTRUCTION","WOOD TECHNOLOGY"'::TEXT[], NULL, '{"staff":["Dr. Fredrick Simpeh"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('13-15', 'usted-ksi', '13', '15', 0, 'Staff Office – Dr. Jacob Ofori-Darko (Department of Construction and Wood Technology Education)', '"DR. JACOB OFORI-DARKO","OFORI-DARKO","FTE 15","FTE ROOM 15","ROOM 15","15","DEPARTMENT OF CONSTRUCTION AND WOOD TECHNOLOGY EDUCATION","DCWTE","CONSTRUCTION","WOOD TECHNOLOGY"'::TEXT[], NULL, '{"staff":["Dr. Jacob Ofori-Darko"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('13-28', 'usted-ksi', '13', '28', 0, 'Staff Office – Dr. Joseph Frank Gordon (Department of Mathematics Education)', '"DR. JOSEPH FRANK GORDON","GORDON","FTE 28","FTE ROOM 28","ROOM 28","28","DEPARTMENT OF MATHEMATICS EDUCATION","MATHEMATICS","MATHS","PROF. EBENEZER BONYAH","BONYAH"'::TEXT[], NULL, '{"staff":["Dr. Joseph Frank Gordon","Prof. Ebenezer Bonyah"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('13-16', 'usted-ksi', '13', '16', 0, 'Staff Office – Dr. Justice Williams (Department of Construction and Wood Technology Education)', '"DR. JUSTICE WILLIAMS","WILLIAMS","FTE 16","FTE ROOM 16","ROOM 16","16","DEPARTMENT OF CONSTRUCTION AND WOOD TECHNOLOGY EDUCATION","DCWTE","CONSTRUCTION","WOOD TECHNOLOGY"'::TEXT[], NULL, '{"staff":["Dr. Justice Williams"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('13-7', 'usted-ksi', '13', '7', 0, 'Staff Office – Engr. Dr. Elijah Kusi (Department of Construction Technology and Management)', '"ENGR. DR. ELIJAH KUSI","KUSI","FTE 7","FTE ROOM 7","ROOM 7","7","DEPARTMENT OF CONSTRUCTION TECHNOLOGY AND MANAGEMENT","CONSTRUCTION MANAGEMENT"'::TEXT[], NULL, '{"staff":["Engr. Dr. Elijah Kusi"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('13-26', 'usted-ksi', '13', '26', 0, 'Staff Office – Ms. Akosua Afriyie Addi (Department of Electrical and Electronic Engineering Technology Education)', '"MS. AKOSUA AFRIYIE ADDI","ADDI","FTE 26","FTE ROOM 26","ROOM 26","26","DEPARTMENT OF ELECTRICAL AND ELECTRONIC ENGINEERING TECHNOLOGY EDUCATION","ELECTRICAL","ELECTRONICS"'::TEXT[], NULL, '{"staff":["Ms. Akosua Afriyie Addi"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('14-kitchen-1', 'usted-ksi', '14', 'Kitchen 1', 0, 'Main kitchen lab', '"CATERING LAB GF","CATERING LAB ROOM KITCHEN 1","CATERING LAB KITCHEN 1"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('15-design-room', 'usted-ksi', '15', 'Design Room', 1, 'Fashion design studio', '"FASHION LAB FF","FASHION LAB DESIGN ROOM","FASHION LAB ROOM DESIGN ROOM"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('16-annex-workshop', 'usted-ksi', '16', 'Annex Workshop', 0, 'Additional workshop space', '"MECH. ANNEX GF","MECH. ANNEX ROOM ANNEX WORKSHOP","MECH. ANNEX ANNEX WORKSHOP"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('17-garage-1', 'usted-ksi', '17', 'Garage 1', 0, 'Vehicle repair bay', '"AUTO WORKSHOP GARAGE 1","AUTO WORKSHOP ROOM GARAGE 1","AUTO WORKSHOP GF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('18-woodshop', 'usted-ksi', '18', 'Woodshop', 0, 'Woodworking area', '"WOODLAB GF","WOODLAB ROOM WOODSHOP","WOODLAB WOODSHOP"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('21-3', 'usted-ksi', '21', '3', 0, 'Staff Office – Dr. Courage S.K. Dogbe (Department of Management Studies Education)', '"DR. COURAGE S.K. DOGBE","DOGBE","ESA ROOM 3","ESA 3","ROOM 3","3","DEPARTMENT OF MANAGEMENT STUDIES EDUCATION","MANAGEMENT","MANAGEMENT STUDIES","ESA GF","GROUND FLOOR","ESA BLOCK ROOM 3","ESA BLOCK 3","ESA BLOCK GF"'::TEXT[], NULL, '{"staff":["Dr. Courage S.K. Dogbe"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('21-17', 'usted-ksi', '21', '17', 1, 'Staff Office – Prof. Stella Appiah (Department of Hospitality and Tourism Education)', '"PROF. STELLA APPIAH","APPIAH","ESA ROOM 17","ESA 17","ROOM 17","17","DEPARTMENT OF HOSPITALITY AND TOURISM EDUCATION","DHTE","HOSPITALITY","TOURISM","CATERING","ESA FF","1ST FLOOR","ESA BLOCK ROOM 17","ESA BLOCK 17","ESA BLOCK FF"'::TEXT[], NULL, '{"staff":["Prof. Stella Appiah"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('21-15', 'usted-ksi', '21', '15', 1, 'Staff Office – Veronica Adwoa Agyare (Department of Hospitality and Tourism Education)', '"VERONICA ADWOA AGYARE","AGYARE","ESA ROOM 15","ESA 15","ROOM 15","15","DEPARTMENT OF HOSPITALITY AND TOURISM EDUCATION","DHTE","HOSPITALITY","TOURISM","CATERING","ESA FF","1ST FLOOR","ESA BLOCK ROOM 15","ESA BLOCK 15","ESA BLOCK FF"'::TEXT[], NULL, '{"staff":["Veronica Adwoa Agyare"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('24-201', 'usted-ksi', '24', '201', 2, 'Lecture room', '"ECONOMICS DEPT. 201","ECONOMICS DEPT. ROOM 201","ECONOMICS DEPT. SF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-lecture-room-001', 'usted-ksi', '25', 'Lecture Room 001', 0, 'Large lecture hall', '"ROB GF","LECTURE 1","ROB 001","RM 1","ROB ROOM 001","ROB LECTURE ROOM 001","ROOM 1","ROB 1","ROB ROOM 1"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-lecture-room-025', 'usted-ksi', '25', 'Lecture Room 025', 0, 'Large lecture hall', '"ROB GF","LECTURE 25","ROB ROOM 025","ROB 025","ROB 25","ROOM 25","RM 25","ROB ROOM 25","ROB LECTURE ROOM 025"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-lecture-room-003', 'usted-ksi', '25', 'Lecture Room 003', 1, 'Large lecture hall', '"ROB FF","ROB 3","ROB LECTURE ROOM 003","ROB ROOM 3","RM 3","LECTURE 3","ROB ROOM 003","ROOM 3","ROB 003"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-lecture-room-023', 'usted-ksi', '25', 'Lecture Room 023', 1, 'Large lecture hall', '"ROB FF","ROB ROOM 023","RM 23","ROB ROOM 23","ROOM 23","LECTURE 23","ROB 23","ROB LECTURE ROOM 023","ROB 023"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-department-of-languages', 'usted-ksi', '25', 'Department of Languages', 0, 'Academic department office', '"ROB GF","ROB DEPARTMENT OF LANGUAGES","LANGUAGES","ENGLISH","LINGUISTICS"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-department-of-management', 'usted-ksi', '25', 'Department of Management', 2, 'FBE Management Studies HOD office', '"MANAGEMENT","ROB DEPARTMENT OF MANAGEMENT","ROB SF","HOD","MANAGEMENT HOD","ROB 039","FBE MANAGEMENT STUDIES HOD OFFICE"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-department-of-accounting', 'usted-ksi', '25', 'Department of Accounting', 2, 'FBE Accounting Studies HOD office', '"FINANCE","ROB DEPARTMENT OF ACCOUNTING","ROB SF","ACCOUNTING","AUDIT","HOD","ACCOUNTING HOD","ROB 040","FBE ACCOUNTING STUDIES HOD OFFICE"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-022', 'usted-ksi', '25', '022', 1, 'DEL HOD Office (Languages)', '"HOD","DEL","LANGUAGES HOD","ROB 022","ROB ROOM 022","DEL HOD OFFICE","LANGUAGES HOD OFFICE","ROB FF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-023', 'usted-ksi', '25', '023', 1, 'DIS HOD Office (Interdisciplinary)', '"HOD","DIS","INTERDISCIPLINARY HOD","ROB 023","ROB ROOM 023","DIS HOD OFFICE","INTERDISCIPLINARY HOD OFFICE","ROB FF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-046', 'usted-ksi', '25', '046', 2, 'Accounting Exams Office', '"ACCOUNTING EXAMS","EXAMS OFFICE","ROB 046","ROB ROOM 046","ACCOUNTING EXAMS OFFICE","ROB SF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-047', 'usted-ksi', '25', '047', 2, 'Management Exams Office', '"MANAGEMENT EXAMS","EXAMS OFFICE","ROB 047","ROB ROOM 047","MANAGEMENT EXAMS OFFICE","ROB SF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-computer-lab-016', 'usted-ksi', '25', 'Computer Lab 016', 4, 'Advanced computing laboratory', '"ROB 16","ROB ROOM COMPUTER LAB 016","ICT","ROB 016","ROB 4F","ROB COMPUTER LAB 016","ROB ROOM 16","LAB","COMPUTER","ROB ROOM 016"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-045', 'usted-ksi', '25', '045', 2, 'Staff Office – ASSOC. PROF. DR. DR. FRANK YAO GBADAGO (Department of Accounting Studies Education)', '"ASSOC. PROF. DR. DR. FRANK YAO GBADAGO","GBADAGO","ROB 045","ROB ROOM 045","ROOM 045","045","DEPARTMENT OF ACCOUNTING STUDIES EDUCATION","ACCOUNTING","FINANCE","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["ASSOC. PROF. DR. DR. FRANK YAO GBADAGO"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-34', 'usted-ksi', '25', 'Rm 34', 2, 'Staff Office – Dr. (Mrs) Veronica Adu-Brobbey (Department of Management Studies Education)', '"DR. (MRS) VERONICA ADU-BROBBEY","ADU-BROBBEY","ROB RM 34","ROB 34","ROB ROOM 34","ROOM 34","RM 34","34","DEPARTMENT OF MANAGEMENT STUDIES EDUCATION","MANAGEMENT","MANAGEMENT STUDIES","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["Dr. (Mrs) Veronica Adu-Brobbey"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-005', 'usted-ksi', '25', '005', 0, 'Staff Office – Dr. James Nsoh Adogpa (Department of Interdisciplinary Studies)', '"DR. JAMES NSOH ADOGPA","ADOGPA","ROB 005","ROB ROOM 005","ROOM 005","005","DEPARTMENT OF INTERDISCIPLINARY STUDIES","DIS","INTERDISCIPLINARY","IDS","ROB GF","GROUND FLOOR"'::TEXT[], NULL, '{"staff":["Dr. James Nsoh Adogpa"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-3', 'usted-ksi', '25', 'Rm 3', 0, 'Staff Office – Dr. Jonathan Essuman (Department of Languages Education)', '"DR. JONATHAN ESSUMAN","ESSUMAN","ROB RM 3","ROB 3","ROB ROOM 3","ROOM 3","RM 3","3","DEPARTMENT OF LANGUAGES EDUCATION","LANGUAGES","ENGLISH","LINGUISTICS","ROB GF","GROUND FLOOR"'::TEXT[], NULL, '{"staff":["Dr. Jonathan Essuman"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-018', 'usted-ksi', '25', '018', 1, 'Staff Office – Dr. Kotor Asare (Department of Interdisciplinary Studies)', '"DR. KOTOR ASARE","ASARE","ROB 018","ROB ROOM 018","ROOM 018","018","DEPARTMENT OF INTERDISCIPLINARY STUDIES","DIS","INTERDISCIPLINARY","IDS","ROB FF","1ST FLOOR"'::TEXT[], NULL, '{"staff":["Dr. Kotor Asare"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-021', 'usted-ksi', '25', '021', 1, 'Staff Office – Dr. Kwadwo Arhin (Department of Economics Education)', '"DR. KWADWO ARHIN","ARHIN","ROB 021","ROB ROOM 021","ROOM 021","021","DEPARTMENT OF ECONOMICS EDUCATION","ECONOMICS","ROB FF","1ST FLOOR"'::TEXT[], NULL, '{"staff":["Dr. Kwadwo Arhin"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-037', 'usted-ksi', '25', '037', 2, 'Staff Office – Dr. Lawyer Mrs. Ohenewaa Boateng Newman (Department of Management Studies Education)', '"DR. LAWYER MRS. OHENEWAA BOATENG NEWMAN","NEWMAN","ROB 037","ROB ROOM 037","ROOM 037","037","DEPARTMENT OF MANAGEMENT STUDIES EDUCATION","MANAGEMENT","MANAGEMENT STUDIES","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["Dr. Lawyer Mrs. Ohenewaa Boateng Newman"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-30', 'usted-ksi', '25', '30', 2, 'Staff Office – Mrs. Gertrude Effeh Brew (Guidance and Counselling Centre)', '"ROB RM 30","ROB 30","ROB ROOM 30","ROOM 30","RM 30","30","ROB SF","2ND FLOOR","MRS. GERTRUDE EFFEH BREW","BREW","GUIDANCE AND COUNSELLING CENTRE"'::TEXT[], NULL, '{"staff":["Mrs. Gertrude Effeh Brew"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-54', 'usted-ksi', '25', 'Rm 54', 3, 'Staff Office – FRANCIS OPUNI KESSEH, ESQ. (Department of Management Studies Education)', '"FRANCIS OPUNI KESSEH, ESQ.","ESQ.","ROB RM 54","ROB 54","ROB ROOM 54","ROOM 54","RM 54","54","DEPARTMENT OF MANAGEMENT STUDIES EDUCATION","MANAGEMENT","MANAGEMENT STUDIES","ROB 3F","3RD FLOOR"'::TEXT[], NULL, '{"staff":["FRANCIS OPUNI KESSEH, ESQ."]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-008', 'usted-ksi', '25', '008', 0, 'Staff Office – Mr. Eric Effah Sarkodie (Department of Economics Education)', '"MR. ERIC EFFAH SARKODIE","SARKODIE","ROB 008","ROB ROOM 008","ROOM 008","008","DEPARTMENT OF ECONOMICS EDUCATION","ECONOMICS","ROB GF","GROUND FLOOR","PROF. JOSEPH ANTWI BAAFI","BAAFI"'::TEXT[], NULL, '{"staff":["Mr. Eric Effah Sarkodie","Prof. Joseph Antwi Baafi"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-26', 'usted-ksi', '25', 'Rm 26', 2, 'Staff Office – Mr. Ficus Gyasi (Department of Interdisciplinary Studies)', '"MR. FICUS GYASI","GYASI","ROB RM 26","ROB 26","ROB ROOM 26","ROOM 26","RM 26","26","DEPARTMENT OF INTERDISCIPLINARY STUDIES","DIS","INTERDISCIPLINARY","IDS","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["Mr. Ficus Gyasi"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-16', 'usted-ksi', '25', 'Rm 16', 1, 'Staff Office – Mr. Franklin Benjamin Appiah (Department of Languages Education)', '"MR. FRANKLIN BENJAMIN APPIAH","APPIAH","ROB RM 16","ROB 16","ROB ROOM 16","ROOM 16","RM 16","16","DEPARTMENT OF LANGUAGES EDUCATION","LANGUAGES","ENGLISH","LINGUISTICS","ROB FF","1ST FLOOR"'::TEXT[], NULL, '{"staff":["Mr. Franklin Benjamin Appiah"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-office-no-19', 'usted-ksi', '25', 'Office No. 19', 1, 'Staff Office – Mr. Philip Boateng (Department of Interdisciplinary Studies)', '"MR. PHILIP BOATENG","BOATENG","ROB OFFICE NO. 19","ROB NO. 19","ROB ROOM NO. 19","ROOM NO. 19","OFFICE NO. 19","NO. 19","DEPARTMENT OF INTERDISCIPLINARY STUDIES","DIS","INTERDISCIPLINARY","IDS","ROB FF","1ST FLOOR"'::TEXT[], NULL, '{"staff":["Mr. Philip Boateng"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-25', 'usted-ksi', '25', 'Rm 25', 1, 'Staff Office – Mr. Sylvanus Kofie (Department of Interdisciplinary Studies)', '"MR. SYLVANUS KOFIE","KOFIE","ROB RM 25","ROB 25","ROB ROOM 25","ROOM 25","RM 25","25","DEPARTMENT OF INTERDISCIPLINARY STUDIES","DIS","INTERDISCIPLINARY","IDS","ROB FF","1ST FLOOR"'::TEXT[], NULL, '{"staff":["Mr. Sylvanus Kofie"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-044', 'usted-ksi', '25', '044', 2, 'Staff Office – Mr. Williams Kwasi Boachie (Department of Economics Education)', '"MR. WILLIAMS KWASI BOACHIE","BOACHIE","ROB 044","ROB ROOM 044","ROOM 044","044","DEPARTMENT OF ECONOMICS EDUCATION","ECONOMICS","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["Mr. Williams Kwasi Boachie"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-school-of-graduate-studies', 'usted-ksi', '25', 'School of Graduate Studies', 3, 'Staff Office – Mrs. Emma Maame Afua Darkoa Douglas Anyan (School of Graduate Studies)', '"MRS. EMMA MAAME AFUA DARKOA DOUGLAS ANYAN","ANYAN","ROB SCHOOL OF GRADUATE STUDIES","ROB ROOM SCHOOL OF GRADUATE STUDIES","ROOM SCHOOL OF GRADUATE STUDIES","SCHOOL OF GRADUATE STUDIES","SGS","GRADUATE STUDIES","ROB 3F","3RD FLOOR","PROF. HUMPREY DANSO","DANSO","DEPARTMENT OF CONSTRUCTION AND WOOD TECHNOLOGY EDUCATION","DCWTE","CONSTRUCTION","WOOD TECHNOLOGY"'::TEXT[], NULL, '{"staff":["Mrs. Emma Maame Afua Darkoa Douglas Anyan","Prof. Humprey Danso"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-office-rm-1', 'usted-ksi', '25', 'Office Rm 1', 0, 'Staff Office – Prince Gyimah (PhD, FChPA) (Department of Accounting Education)', '"PRINCE GYIMAH (PHD, FCHPA)","FCHPA)","ROB OFFICE RM 1","ROB RM 1","ROB ROOM RM 1","ROOM RM 1","OFFICE RM 1","RM 1","DEPARTMENT OF ACCOUNTING EDUCATION","ACCOUNTING","FINANCE","ROB GF","GROUND FLOOR"'::TEXT[], NULL, '{"staff":["Prince Gyimah (PhD, FChPA)"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-37', 'usted-ksi', '25', 'Rm 37', 2, 'Staff Office – Prof. Dr. Masud Ibrahim (Department of Management Studies Education)', '"PROF. DR. MASUD IBRAHIM","IBRAHIM","ROB RM 37","ROB 37","ROB ROOM 37","ROOM 37","RM 37","37","DEPARTMENT OF MANAGEMENT STUDIES EDUCATION","MANAGEMENT","MANAGEMENT STUDIES","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["Prof. Dr. Masud Ibrahim"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-32', 'usted-ksi', '25', 'Rm 32', 2, 'Staff Office – PROF. ISAAC ADDAI (Department of Interdisciplinary Studies)', '"PROF. ISAAC ADDAI","ADDAI","ROB RM 32","ROB 32","ROB ROOM 32","ROOM 32","RM 32","32","DEPARTMENT OF INTERDISCIPLINARY STUDIES","DIS","INTERDISCIPLINARY","IDS","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["PROF. ISAAC ADDAI"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-42', 'usted-ksi', '25', 'Rm 42', 2, 'Staff Office – Rabiatu Kamil (Ph.D. FCCA, ICAG) (Department of Accounting Education)', '"RABIATU KAMIL (PH.D. FCCA, ICAG)","ICAG)","ROB RM 42","ROB 42","ROB ROOM 42","ROOM 42","RM 42","42","DEPARTMENT OF ACCOUNTING EDUCATION","ACCOUNTING","FINANCE","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["Rabiatu Kamil (Ph.D. FCCA, ICAG)"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('25-rm-27', 'usted-ksi', '25', 'Rm 27', 2, 'Staff Office – Sr. Dr. Mary Assumpta Ayikue (Department of Educational Leadership)', '"SR. DR. MARY ASSUMPTA AYIKUE","AYIKUE","ROB RM 27","ROB 27","ROB ROOM 27","ROOM 27","RM 27","27","DEPARTMENT OF EDUCATIONAL LEADERSHIP","DEL","EDUCATIONAL LEADERSHIP","ROB SF","2ND FLOOR"'::TEXT[], NULL, '{"staff":["Sr. Dr. Mary Assumpta Ayikue"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('26-dept-doc-web-mgt-main-adm-blk', 'usted-ksi', '26', 'Dept. Doc. & Web Mgt. - Main Adm. Blk.', 0, 'Staff Office – Donald Yeboah (Department of Information Technology Education)', '"DONALD YEBOAH","YEBOAH","ADMIN BLOCK DEPT. DOC. & WEB MGT. - MAIN ADM. BLK.","ADMIN BLOCK ROOM DEPT. DOC. & WEB MGT. - MAIN ADM. BLK.","ROOM DEPT. DOC. & WEB MGT. - MAIN ADM. BLK.","DEPT. DOC. & WEB MGT. - MAIN ADM. BLK.","DEPARTMENT OF INFORMATION TECHNOLOGY EDUCATION","IT","ICT","INFORMATION TECHNOLOGY","ITE","INFORMATION TECHNOLOGY EDUCATION","FASME"'::TEXT[], NULL, '{"staff":["Donald Yeboah"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('26-main-admin-block', 'usted-ksi', '26', 'Main Admin. Block', 0, 'Staff Office – Nicholas Donkor (Directorate of IT Services)', '"NICHOLAS DONKOR","DONKOR","ADMIN BLOCK MAIN ADMIN. BLOCK","ADMIN BLOCK ROOM MAIN ADMIN. BLOCK","ROOM MAIN ADMIN. BLOCK","MAIN ADMIN. BLOCK","DIRECTORATE OF IT SERVICES","ADMIN BLOCK FL","TOP FLOOR"'::TEXT[], NULL, '{"staff":["Nicholas Donkor"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('27-lab-1', 'usted-ksi', '27', 'Lab 1', 0, 'Computer lab', '"ICT LAB LAB 1","ICT LAB GF","ICT LAB 1","ICT LAB ROOM 1"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('27-lab-2', 'usted-ksi', '27', 'Lab 2', 1, 'Advanced computing lab', '"ICT LAB 2","ICT LAB LAB 2","ICT LAB ROOM 2","ICT LAB FF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('28-101', 'usted-ksi', '28', '101', 1, 'Faculty office', '"FASME ROOM 101","FASME FF","FASME 101"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('28-10', 'usted-ksi', '28', '10', 1, 'Staff Office – Dr. Adasa Nkrumah Kofi Frimpong (Department of Information Technology Education)', '"DR. ADASA NKRUMAH KOFI FRIMPONG","FRIMPONG","FASME 10","FASME ROOM 10","ROOM 10","10","DEPARTMENT OF INFORMATION TECHNOLOGY EDUCATION","IT","ICT","INFORMATION TECHNOLOGY","FASME FF","1ST FLOOR","ITE","INFORMATION TECHNOLOGY EDUCATION","FASME"'::TEXT[], NULL, '{"staff":["Dr. Adasa Nkrumah Kofi Frimpong"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('29-201', 'usted-ksi', '29', '201', 2, 'Graduate study area', '"GRAD BLOCK SF","GRAD BLOCK 201","GRAD BLOCK ROOM 201"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('30-office-of-the-dean-of-student-affairs', 'usted-ksi', '30', 'Office of the Dean of Student Affairs', 0, 'Staff Office – Prof. Dr. Philip Oti-Agyen (Department of Educational Leadership)', '"PROF. DR. PHILIP OTI-AGYEN","OTI-AGYEN","ODSA OFFICE OF THE DEAN OF STUDENT AFFAIRS","ODSA OF THE DEAN OF STUDENT AFFAIRS","ODSA ROOM OF THE DEAN OF STUDENT AFFAIRS","ROOM OF THE DEAN OF STUDENT AFFAIRS","OFFICE OF THE DEAN OF STUDENT AFFAIRS","OF THE DEAN OF STUDENT AFFAIRS","DEPARTMENT OF EDUCATIONAL LEADERSHIP","DEL","EDUCATIONAL LEADERSHIP","ODSA GF","GROUND FLOOR"'::TEXT[], NULL, '{"staff":["Prof. Dr. Philip Oti-Agyen"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('32-15', 'usted-ksi', '32', '15', 1, 'Student room', '"OW II HALL FF","OW II HALL 15","OW II HALL ROOM 15"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('42-10', 'usted-ksi', '42', '10', 1, 'Student accommodation', '"AUTONOMY HALL ROOM 10","AUTONOMY HALL 10","AUTONOMY HALL FF"'::TEXT[], NULL, '{"staff":[]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-20', 'usted-ksi', '35', '20', 0, 'Staff Office – Abigail Nkansah (Department of Fashion Design and Textiles Education)', '"ABIGAIL NKANSAH","NKANSAH","CBT ROOM 20","CBT 20","ROOM 20","20","DEPARTMENT OF FASHION DESIGN AND TEXTILES EDUCATION","DFDTE","FASHION","TEXTILES","DR. PHYLLIS MENSAH","MENSAH"'::TEXT[], NULL, '{"staff":["Abigail Nkansah","Dr. Phyllis Mensah"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-026', 'usted-ksi', '35', '026', 0, 'Staff Office – Andrew Adu Asabere (Department of Fashion Design and Textiles Education)', '"ANDREW ADU ASABERE","ASABERE","CBT 026","CBT ROOM 026","ROOM 026","026","DEPARTMENT OF FASHION DESIGN AND TEXTILES EDUCATION","DFDTE","FASHION","TEXTILES"'::TEXT[], NULL, '{"staff":["Andrew Adu Asabere"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-033', 'usted-ksi', '35', '033', 0, 'Staff Office – Charlotte Caitoe (Department of Hospitality and Tourism Education)', '"CHARLOTTE CAITOE","CAITOE","CBT 033","CBT ROOM 033","ROOM 033","033","DEPARTMENT OF HOSPITALITY AND TOURISM EDUCATION","DHTE","HOSPITALITY","TOURISM","CATERING","DR. MRS. MERCY BOADI","BOADI"'::TEXT[], NULL, '{"staff":["Charlotte Caitoe","Dr. Mrs. Mercy Boadi"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-033-cbt-13', 'usted-ksi', '35', '033 , CBT 13', 0, 'Staff Office – Claudia Miakimeni Pumpuni (Department of Hospitality and Tourism Education)', '"CLAUDIA MIAKIMENI PUMPUNI","PUMPUNI","CBT 033 , CBT 13","CBT ROOM 033 , CBT 13","ROOM 033 , CBT 13","033 , CBT 13","DEPARTMENT OF HOSPITALITY AND TOURISM EDUCATION","DHTE","HOSPITALITY","TOURISM","CATERING"'::TEXT[], NULL, '{"staff":["Claudia Miakimeni Pumpuni"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-12', 'usted-ksi', '35', '12', 0, 'Staff Office – Doreen Dedo Adi (Department of Hospitality and Tourism Education)', '"DOREEN DEDO ADI","ADI","CBT ROOM 12","CBT 12","ROOM 12","12","DEPARTMENT OF HOSPITALITY AND TOURISM EDUCATION","DHTE","HOSPITALITY","TOURISM","CATERING"'::TEXT[], NULL, '{"staff":["Doreen Dedo Adi"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-007', 'usted-ksi', '35', '007', 0, 'Staff Office – Dr Daniel Kwabena Danso (Department of Fashion Design and Textiles Education)', '"DR DANIEL KWABENA DANSO","DANSO","CBT 007","CBT ROOM 007","ROOM 007","007","DEPARTMENT OF FASHION DESIGN AND TEXTILES EDUCATION","DFDTE","FASHION","TEXTILES"'::TEXT[], NULL, '{"staff":["Dr Daniel Kwabena Danso"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-005', 'usted-ksi', '35', '005', 0, 'Staff Office – Dr. Haruna Ibrahim (Department of Fashion Design and Textiles Education)', '"DR. HARUNA IBRAHIM","IBRAHIM","CBT ROOM 005","CBT 005","ROOM 005","005","DEPARTMENT OF FASHION DESIGN AND TEXTILES EDUCATION","DFDTE","FASHION","TEXTILES"'::TEXT[], NULL, '{"staff":["Dr. Haruna Ibrahim"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-034', 'usted-ksi', '35', '034', 0, 'Staff Office – Dr. Mrs. Florence Brenyah (Department of Hospitality and Tourism Education)', '"DR. MRS. FLORENCE BRENYAH","BRENYAH","CBT 034","CBT ROOM 034","ROOM 034","034","DEPARTMENT OF HOSPITALITY AND TOURISM EDUCATION","DHTE","HOSPITALITY","TOURISM","CATERING","MISS NAFISATU SALAM","SALAM"'::TEXT[], NULL, '{"staff":["Dr. Mrs. Florence Brenyah","Miss Nafisatu Salam"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-006', 'usted-ksi', '35', '006', 0, 'Staff Office – Dr. Ninette Afi Appiah (Department of Fashion Design and Textiles Education)', '"DR. NINETTE AFI APPIAH","APPIAH","CBT 006","CBT ROOM 006","ROOM 006","006","DEPARTMENT OF FASHION DESIGN AND TEXTILES EDUCATION","DFDTE","FASHION","TEXTILES"'::TEXT[], NULL, '{"staff":["Dr. Ninette Afi Appiah"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-032', 'usted-ksi', '35', '032', 0, 'Staff Office – Mrs. Abena Sekyere (Department of Hospitality and Tourism Education)', '"MRS. ABENA SEKYERE","SEKYERE","CBT 032","CBT ROOM 032","ROOM 032","032","DEPARTMENT OF HOSPITALITY AND TOURISM EDUCATION","DHTE","HOSPITALITY","TOURISM","CATERING"'::TEXT[], NULL, '{"staff":["Mrs. Abena Sekyere"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-r5', 'usted-ksi', '35', 'R5', 0, 'Staff Office – Prof. Dr. Isaac Abraham (Department of Fashion Design and Textiles Education (DFDTE))', '"PROF. DR. ISAAC ABRAHAM","ABRAHAM","CBT R5","CBT ROOM R5","ROOM R5","R5","DEPARTMENT OF FASHION DESIGN AND TEXTILES EDUCATION (DFDTE)","DFDTE","FASHION","TEXTILES"'::TEXT[], NULL, '{"staff":["Prof. Dr. Isaac Abraham"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('35-025', 'usted-ksi', '35', '025', 0, 'Staff Office – Prof. Josephine Aboagyewaa-Ntiri (Department of Fashion Design and Textiles Education)', '"PROF. JOSEPHINE ABOAGYEWAA-NTIRI","ABOAGYEWAA-NTIRI","CBT 025","CBT ROOM 025","ROOM 025","025","DEPARTMENT OF FASHION DESIGN AND TEXTILES EDUCATION","DFDTE","FASHION","TEXTILES"'::TEXT[], NULL, '{"staff":["Prof. Josephine Aboagyewaa-Ntiri"]}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;
INSERT INTO rooms (id, org_id, building_id, room_number, floor, description, keywords, coordinates, metadata)
VALUES ('21-esa', 'usted-ksi', '21', 'ESA', 1, 'Sawan Dankyi Office (Department of Hospitality and Tourism Education)', '"ESA","SAWAN DANKYI"'::TEXT[], NULL, '{"auto_created_from_staff":"Sawan Dankyi"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  building_id = EXCLUDED.building_id,
  room_number = EXCLUDED.room_number,
  floor = EXCLUDED.floor,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  coordinates = EXCLUDED.coordinates,
  metadata = EXCLUDED.metadata;

-- 3. Insert Staff Directory
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('abigail-nkansah', 'usted-ksi', 'Abigail Nkansah', 'Ms.', 'Assist. Lecturer', 'Department of Fashion Design and Textiles Education', 'Faculty of Vocational Education (FVE)', '35', '35-20', 0, 'ankansah@aamusted.edu.gh', '+233 24 646 3586', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('andrew-adu-asabere', 'usted-ksi', 'Andrew Adu Asabere', 'Mr.', 'Assist. Lecturer', 'Department of Fashion Design and Textiles Education', 'Faculty of Vocational Education (FVE)', '35', '35-026', 0, 'aaasabere@aamusted.edu.gh', '+233 24 615 1792', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('antwi-edmund', 'usted-ksi', 'Antwi Edmund', '', 'Assist. Lecturer', 'Department of Mechanical and Automotive Technology Education', 'Faculty of Engineering and Technology (FET)', NULL, NULL, 0, 'eantwi@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('arc-wisdom-d-adzraku', 'usted-ksi', 'Arc. Wisdom D. Adzraku', 'Arc.', 'Senior Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('assoc-prof-dr-dr-frank-yao-gbadago', 'usted-ksi', 'ASSOC. PROF. DR. DR. FRANK YAO GBADAGO', 'Assoc. Prof. Dr. Dr.', 'Head Department Of Accounting Studies Education', 'Department of Accounting Studies Education', 'Faculty of Business Education (FBE)', '25', '25-045', 2, 'frankggh@yahoo.com', '+233 24 282 4124', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('assoc-prof-kwaku-antwi', 'usted-ksi', 'Associate Professor Dr. Engr. Kwaku Antwi', 'Assoc. Prof. Dr. Engr.', 'Assoc Prof, Head of Department', 'Department of Civil Engineering', 'Faculty of Engineering and Technology (FET)', '13', '13-02', 0, 'antwikwaku10@gmail.com', '+233 20 815 0964', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('charlotte-caitoe', 'usted-ksi', 'Charlotte Caitoe', '', 'Assist. Lecturer', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '35', '35-033', 0, 'ccaitoe@aamusted.edu.gh', '+233 24 080 2281', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('chibudo-kenneth-nworu', 'usted-ksi', 'Chibudo Kenneth Nworu', '', 'Lecturer', 'Department of Mechanical and Automotive Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('claudia-miakimeni-pumpuni', 'usted-ksi', 'Claudia Miakimeni Pumpuni', 'Ms.', 'Lecturer', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '35', '35-033-cbt-13', 0, 'cmpumpuni@aamusted.edu.gh', '+233 50 724 7317', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('donald-yeboah', 'usted-ksi', 'Donald Yeboah', '', 'Snr It Asst', 'Department of Information Technology Education', 'Directorate of IT Services', '26', '26-dept-doc-web-mgt-main-adm-blk', 0, 'ydonald@aamusted.edu.gh', '+233 24 263 7542', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('doreen-dedo-adi', 'usted-ksi', 'Doreen Dedo Adi', 'Prof.', 'Assoc Prof', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '35', '35-12', 0, 'ddadi@aamusted.edu.gh', '+233 50 727 2700', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-mrs-ellen-animah-agyei', 'usted-ksi', 'Dr (Mrs) Ellen Animah Agyei', 'Dr. (Mrs.)', 'Lecturer', 'Department of Economics Education', 'Faculty of Business Education (FBE)', '25', NULL, 0, 'eanimahagyei@aamuated.edu.gh', '+233 26 376 1536', 'building_only', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-daniel-kwabena-danso', 'usted-ksi', 'Dr Daniel Kwabena Danso', 'Dr.', 'FVE Examination Officer , Senior Lecturer', 'Department of Fashion Design and Textiles Education', 'Faculty of Vocational Education (FVE)', '35', '35-007', 0, 'dansartgh@yahoo.com', '+233 24 485 1798, +233 20 380 9532', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-mrs-veronica-adu-brobbey', 'usted-ksi', 'Dr. (Mrs) Veronica Adu-Brobbey', 'Dr. (Mrs.)', 'Senior Lecturer', 'Department of Management Studies Education', 'Faculty of Business Education (FBE)', '25', '25-rm-34', 2, 'vabrobbey@aamusted.edu.gh', '+233 20 811 4898', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-mrs-priscilla-oyeladun-ajiboye', 'usted-ksi', 'Dr. (Mrs.) Priscilla Oyeladun Ajiboye', 'Dr. (Mrs.)', 'Lecturer', 'Department of Electrical and Electronic Engineering Technology Education', 'Faculty of Engineering and Technology (FET)', NULL, NULL, 0, 'poajiboye@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-adasa-nkrumah-kofi-frimpong', 'usted-ksi', 'Dr. Adasa Nkrumah Kofi Frimpong', 'Dr.', 'Lecturer Ag Head Academic And Administrative Computing', 'Department of Information Technology Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', '28', '28-10', 1, 'adasankrumahkf@aamusted.edu.gh', '+233 550 241 711', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-appiagyei-ebenezer', 'usted-ksi', 'Dr. Appiagyei Ebenezer', 'Dr.', 'Lecturer', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, 'sirpaddy2014@gmail.com', '+233548753871', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-claudia-nyarko-mensah', 'usted-ksi', 'Dr. Claudia Nyarko Mensah (Ph.D)', 'Dr.', 'Senior Lecturer', 'Department of Human Resource and Business Strategy', 'Faculty of Business Education (FBE)', NULL, NULL, 0, 'cnmensah@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-courage-s-k-dogbe', 'usted-ksi', 'Dr. Courage S.K. Dogbe', 'Dr.', 'Senior Lecturer', 'Department of Management Studies Education', 'Faculty of Business Education (FBE)', '21', '21-3', 0, 'courageskd@gmail.com', '+233 24 919 7966', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-emmanuel-akweittey', 'usted-ksi', 'Dr. Emmanuel Akweittey', 'Dr.', 'H.O.D, DME , Senior Lecturer', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, 'eakweittey@aamusted.edu.gh', '+233 24 357 0191', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('engr-martha-danso-mrs', 'usted-ksi', 'Dr. Engr. Martha Danso (Mrs)', 'Dr. Engr.', 'Senior Lecturer', 'Department of Mechanical and Automotive Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, 'mdanso@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-p-n-ayambire', 'usted-ksi', 'Dr. Engr. P. N. Ayambire', 'Dr. Engr.', 'Lecturer', 'Department of Electrical and Electronic Engineering Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, 'pnayambire@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-ernest-larbi', 'usted-ksi', 'Dr. Ernest Larbi', 'Dr.', 'Lecturer', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, 'elarbi@aamusted.edu.gh', '+233 24 481 2402', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-fredrick-simpeh', 'usted-ksi', 'Dr. Fredrick Simpeh', 'Dr.', 'Senior Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', '13', '13-09', 0, 'fsimpeh@aamusted.edu.gh', '+233 55 552 9329', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-george-asante', 'usted-ksi', 'Dr. George Asante', 'Dr.', 'Senior Lecturer', 'Department of Information Technology Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, 'gasante@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-haruna-ibrahim', 'usted-ksi', 'Dr. Haruna Ibrahim', 'Dr.', 'Lecturer', 'Department of Fashion Design and Textiles Education', 'Faculty of Vocational Education (FVE)', '35', '35-005', 0, 'harunaibrahim@aamusted.edu.gh', '+233 24 405 3065, +233 50 933 8684', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-ing-koffi-a-dotche', 'usted-ksi', 'Dr. Ing. Koffi A. Dotche', 'Dr. Ing.', 'Lecturer', 'Department of Electrical and Electronic Engineering Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-jacob-ofori-darko', 'usted-ksi', 'Dr. Jacob Ofori-Darko', 'Dr.', 'Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', '13', '13-15', 0, 'jodarko@aamusted.edu.gh', '+233 24 380 9951', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-james-nsoh-adogpa', 'usted-ksi', 'Dr. James Nsoh Adogpa', 'Dr.', 'Lecturer', 'Department of Interdisciplinary Studies', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-005', 0, 'jnadogpa@aamusted.edu.gh', '+233 24 371 0066', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-jonathan-essuman', 'usted-ksi', 'Dr. Jonathan Essuman', 'Dr.', 'Senior Lecturer', 'Department of Languages Education', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-rm-3', 0, 'jonathanessuman@aamusted.edu.gh', '+233 24 994 1607', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-joseph-frank-gordon', 'usted-ksi', 'Dr. Joseph Frank Gordon', 'Dr.', 'Lecturer', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', '13', '13-28', 0, 'jfgordon@aamusted.edu.gh', '+233 24 365 8174', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-justice-williams', 'usted-ksi', 'Dr. Justice Williams', 'Dr.', 'Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', '13', '13-16', 0, 'justicewilliams@aamusted.edu.gh', '+233 24 491 5867, +233 20 849 1571', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-kotor-asare', 'usted-ksi', 'Dr. Kotor Asare', 'Dr.', 'Lecturer', 'Department of Interdisciplinary Studies', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-018', 1, 'akotor@aamusted.edu.gh', '+233 24 472 5604', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-kwabena-offeh-gyimah', 'usted-ksi', 'Dr. Kwabena Offeh Gyimah', 'Dr.', 'Senior Lecturer', 'Department of Mechanical and Automotive Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, 'kogyimah@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-kwadwo-arhin', 'usted-ksi', 'Dr. Kwadwo Arhin', 'Dr.', 'Lecturer', 'Department of Economics Education', 'Faculty of Business Education (FBE)', '25', '25-021', 1, 'arhinkwadwo@gmail.com', '+233 55 497 3575', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-kwame-acheampong', 'usted-ksi', 'Dr. Kwame Acheampong', 'Dr.', 'Senior Lecturer', 'Department of Economics Education', 'Faculty of Business Education (FBE)', '25', NULL, 0, 'kacheampong@aamusted.edu.gh', '+233 24 453 3261', 'building_only', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('lawyer-mrs-ohenewaa-boateng-newman', 'usted-ksi', 'Dr. Lawyer Mrs. Ohenewaa Boateng Newman', 'Dr. Lawyer Mrs.', 'Senior Lecturer', 'Department of Management Studies Education', 'Faculty of Business Education (FBE)', '25', '25-037', 2, '', '+233 24 854 3898', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-mark-bright-donkoh', 'usted-ksi', 'Dr. Mark Bright Donkoh', 'Dr.', 'Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-mavis-adu-gyamfi', 'usted-ksi', 'Dr. Mavis Adu-Gyamfi', 'Dr.', 'Lecturer', 'Department of Management Studies Education', 'Faculty of Business Education (FBE)', NULL, NULL, 0, 'magyamfi@aamusted.edu.gh', '+233 24 228 7243', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('florence-brenyah', 'usted-ksi', 'Dr. Mrs. Florence Brenyah', 'Dr. (Mrs.)', 'Lecturer', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '35', '35-034', 0, 'fbrenyah@aamusted.edu.gh', '+233 20 421 3136, +233 54 068 0871', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mercy-boadi', 'usted-ksi', 'Dr. Mrs. Mercy Boadi', 'Dr. (Mrs.)', 'Lecturer', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '35', '35-033', 0, 'Mercyboadi@aamusted.edu.gh', '+233 24 403 8539', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-nathan-ohene-gyang', 'usted-ksi', 'Dr. Nathan Ohene Gyang', 'Dr.', 'Lecturer', 'Department of Interdisciplinary Studies', 'Faculty of Education and Communication Sciences (FECS)', '22', NULL, 0, 'nogyang@aamusted.edu.gh', '+233 54 064 3517, 0244871418', 'building_only', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('ninette-afi-appiah-phd', 'usted-ksi', 'Dr. Ninette Afi Appiah', 'Dr.', 'Senior Lecturer', 'Department of Fashion Design and Textiles Education', 'Faculty of Vocational Education (FVE)', '35', '35-006', 0, 'naappiah@aamusted.edu.gh', '+233 24 324 5251', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-nongiba-a-kheni', 'usted-ksi', 'Dr. Nongiba A. Kheni', 'Dr.', 'Senior Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-philip-baidoo', 'usted-ksi', 'Dr. Philip Baidoo', 'Dr.', 'Senior Lecturer', 'Department of Mechanical and Automotive Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, 'pbaidoo@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('phyllis-mensah', 'usted-ksi', 'Dr. Phyllis Mensah', 'Dr.', 'Assist. Lecturer', 'Department of Fashion Design and Textiles Education', 'Faculty of Vocational Education (FVE)', '35', '35-20', 0, 'phyllismensah@aamusted.edu.gh', '+233 24 409 1973', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-samuel-kwadwo-aboagye', 'usted-ksi', 'Dr. Samuel Kwadwo Aboagye', 'Dr.', 'Lecturer', 'Department of Educational Leadership', 'Faculty of Education and Communication Sciences (FECS)', '22', NULL, 0, 'skaboagye@aamusted.edu.gh', '+233 20 815 0194', 'building_only', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('seth-amoako', 'usted-ksi', 'Dr. Seth Amoako', 'Dr.', 'Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-theresa-dede-lawer', 'usted-ksi', 'Dr. Theresa Dede Lawer', 'Senior Lecturer', 'Senior Lecturer', 'Department of Interdisciplinary Studies (DIS)', 'Faculty of Education and Communication Sciences (FECS)', '26', NULL, 0, 'tdlawer@aamusted.edu.gh', '+233 20 849 6191', 'building_only', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-yaw-boateng-atakorah', 'usted-ksi', 'Dr. Yaw Boateng Atakorah', 'Dr.', 'Lecturer', 'Department of Economics Education', 'Faculty of Business Education (FBE)', NULL, NULL, 0, 'atakorahboateng@gmail.com', '+233 24 280 1889', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('engr-dorothy-manu', 'usted-ksi', 'Engr. Dorothy Manu', 'Engr.', 'Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-albert-k-awopone', 'usted-ksi', 'Engr. Dr. Albert Kotawoke Awopone', 'Engr. Dr.', 'Senior Lecturer', 'Department of Electrical and Electronic Engineering Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, 'aawopone@aamusted.edu.gh', '+233 20 078 4372', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-elijah-kusi', 'usted-ksi', 'Engr. Dr. Elijah Kusi', 'Engr. Dr.', 'Lecturer', 'Department of Construction Technology and Management', 'Faculty of Technical Education (FTE)', '13', '13-7', 0, 'ekusi@aamusted.edu.gh', '+233 24 320 9292', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('francis-opuni-kesseh-esq', 'usted-ksi', 'FRANCIS OPUNI KESSEH, ESQ.', '', 'Lecturer', 'Department of Management Studies Education', 'Faculty of Business Education (FBE)', '25', '25-rm-54', 3, 'fokesseh@aamusted.edu.gh', '+233 24 801 6123', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('franco-osei-wusu', 'usted-ksi', 'Franco Osei-Wusu', '', 'Assist. Lecturer', 'Department of Information Technology Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, '', '+233 54 916 4924', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-enock-andrews-duodu', 'usted-ksi', 'Ing. Dr. Enock Andrews Duodu', '', 'Senior Lecturer', 'Department of Mechanical and Automotive Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-emmanuel-appiah-kubi', 'usted-ksi', 'Ing. Prof. Emmanuel Appiah-Kubi (PhD, SPE-GhIE)', 'Ing. Prof.', 'DEAN, FTE', 'Department of Civil Engineering', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, 'eakubi@aamusted.edu.gh', '+233 24 489 6621', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('miss-nafisatu-salam', 'usted-ksi', 'Miss Nafisatu Salam', 'Miss', 'Lecturer', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '35', '35-034', 0, '', '+233 24 313 0102', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('abraham-yeboah', 'usted-ksi', 'Mr. Abraham Yeboah', 'Mr.', 'Lecturer', 'Department of Interdisciplinary Studies', 'Faculty of Education and Communication Sciences (FECS)', '22', NULL, 0, 'abrahamyeboah@aamusted.edu.gh', '+233 24 070 9156', 'building_only', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-benjamin-mensah', 'usted-ksi', 'Mr. Benjamin Mensah', 'Mr.', 'Assistant Registrar , Head, Planning Section, QAPA', 'Quality Assurance Planning and Accreditation Directorate', '', NULL, NULL, 0, 'bmensah@aamusted.edu.gh', '+233 24 406 8255, +233 20 033 4966, +233 24 458 4794', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-eldad-antwi-bekoe', 'usted-ksi', 'Mr. Eldad Antwi-Bekoe', 'Mr.', 'Senior Lecturer', 'Department of Information Technology Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-eric-effah-sarkodie', 'usted-ksi', 'Mr. Eric Effah Sarkodie', 'Mr.', 'H.O.D - Dept. Economics Edu. , Senior Lecturer', 'Department of Economics Education', 'Faculty of Business Education (FBE)', '25', '25-008', 0, 'eesarkodie@aamusted.edu.gh', '+233 24 681 0974', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-ficus-gyasi', 'usted-ksi', 'Mr. Ficus Gyasi', 'Mr.', 'Senior Lecturer', 'Department of Interdisciplinary Studies', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-rm-26', 2, 'fgyasi@aamusted.edu.gh', '+233 24 321 3799', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-franklin-benjamin-appiah', 'usted-ksi', 'Mr. Franklin Benjamin Appiah', 'Mr.', 'Lecturer', 'Department of Languages Education', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-rm-16', 1, 'fbappiah@yahoo.com', '+233 55 597 4363', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-k-b-owusu-akyaw', 'usted-ksi', 'Mr. K.B. Owusu-Akyaw', 'Mr.', 'Lecturer', 'Department of Construction and Wood Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, '', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-kennedy-gyimah', 'usted-ksi', 'Mr. Kennedy Gyimah', 'Mr.', 'Lecturer', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, 'kennedygyimah@aamusted.edu.gh', '+233 50 137 3042', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-philip-boateng', 'usted-ksi', 'Mr. Philip Boateng', 'Mr.', 'Senior Lecturer', 'Department of Interdisciplinary Studies', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-office-no-19', 1, 'pboateng@aamusted.edu.gh', '+233 24 228 0074', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-sylvanus-kofie', 'usted-ksi', 'Mr. Sylvanus Kofie', 'Mr.', 'Lecturer', 'Department of Interdisciplinary Studies', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-rm-25', 1, 'skofie@aamusted.edu.gh', '+233 24 493 4499', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mr-williams-kwasi-boachie', 'usted-ksi', 'Mr. Williams Kwasi Boachie', 'Mr.', 'Senior Lecturer', 'Department of Economics Education', 'Faculty of Business Education (FBE)', '25', '25-044', 2, 'boachiewilliams@yahoo.com', '+233 249 443 971', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mrs-abena-sekyere', 'usted-ksi', 'Mrs. Abena Sekyere', 'Mrs.', 'Lecturer', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '35', '35-032', 0, 'abenasekyere@aamusted.edu.gh', '+233 24 487 8387', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mrs-emma-maame-afua-darkoa-douglas-anyan', 'usted-ksi', 'Mrs. Emma Maame Afua Darkoa Douglas Anyan', 'Mrs.', 'Snr. Assist. Registrar', 'School of Graduate Studies', 'School of Graduate Studies (SGS)', '25', '25-school-of-graduate-studies', 3, 'edaikins@aamusted.edu.gh', '+233 24 919 4669', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mrs-gertrude-effeh-brew', 'usted-ksi', 'Mrs. Gertrude Effeh Brew', 'Mrs.', 'University Counsellor', 'Guidance and Counselling Centre', '', '25', '25-30', 1, 'gebrew@aamusted.edu.gh', '+233204386324', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('ms-akosua-afriyie-addi', 'usted-ksi', 'Ms. Akosua Afriyie Addi', 'Ms.', 'Prin Admin Assist', 'Department of Electrical and Electronic Engineering Technology Education', 'Faculty of Technical Education (FTE)', '13', '13-26', 0, 'aaaddi@aamusted.edu.gh', '+233 50 836 1140', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('ms-beatrice-acheampong', 'usted-ksi', 'Ms. Beatrice Acheampong', 'Ms.', 'Assistant Registrar', 'Admissions Office', 'Academic Affairs', NULL, NULL, 0, 'bacheampong@aamusted.edu.gh', '+233 24 388 6051', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('nicholas-donkor', 'usted-ksi', 'Nicholas Donkor', '', 'Ag. Director - IT Services', 'Directorate of IT Services', 'Directorate of IT Services', '26', '26-main-admin-block', 0, 'ndonkor@aamusted.edu.gh', '+233 26 464 2114, +233 54 255 7667', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prince-gyimah-phd-fchpa', 'usted-ksi', 'Prince Gyimah (PhD, FChPA)', '', 'Senior Lecturer', 'Department of Accounting Education', 'Faculty of Business Education (FBE)', '25', '25-office-rm-1', 0, 'pgyimah@aamusted.edu.gh', '', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-dr-isaac-abraham', 'usted-ksi', 'Prof. Dr. Isaac Abraham', 'Prof. Dr.', 'Assoc Prof, Head of Department', 'Department of Fashion Design and Textiles Education (DFDTE)', 'Faculty of Vocational Education (FVE)', '35', '35-r5', 0, 'iabraham@aamusted.edu.gh', '+233 24 488 3429', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-dr-masud-ibrahim', 'usted-ksi', 'Prof. Dr. Masud Ibrahim', 'Prof. Dr.', 'Assoc Prof', 'Department of Management Studies Education', 'Faculty of Business Education (FBE)', '25', '25-rm-37', 2, 'mibrahim@aamusted.edu.gh', '', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-dr-philip-oti-agyen', 'usted-ksi', 'Prof. Dr. Philip Oti-Agyen', 'Prof. Dr.', 'Assoc. Prof. , H.O.D, DEL', 'Department of Educational Leadership', 'Faculty of Education and Communication Sciences (FECS)', '30', '30-office-of-the-dean-of-student-affairs', 0, 'poagyen@ammusted.edu.gh', '+233 24 350 6798', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-dr-sherry-kwabla-amedorme', 'usted-ksi', 'Prof. Dr. Sherry Kwabla Amedorme', 'Prof. Dr.', 'Assoc. Prof. , H.O.D, DMATE', 'Department of Mechanical and Automotive Technology Education', 'Faculty of Technical Education (FTE)', NULL, NULL, 0, 'skamedorme@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-ebenezer-bonyah', 'usted-ksi', 'Prof. Ebenezer Bonyah', 'Prof.', 'Ag. Director, DRIPIA', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', '13', '13-28', 0, 'ebonyah@aamusted.edu.gh', '+233243357651', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('professor-edmond-akwasi-agyeman', 'usted-ksi', 'Prof. Edmond Akwasi Agyeman', 'Prof.', 'Director, Quality Assurance, Planning & Accreditation', 'Department of Interdisciplinary Studies', 'Directorate of Quality Assurance Planning and Accreditation (QAPA)', NULL, NULL, 0, 'eaagyeman@aamusted.edu.gh', '', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-francis-ohene-boateng', 'usted-ksi', 'Prof. Francis Ohene Boateng', 'Prof.', 'Assoc Prof', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, 'foboateng@aamusted.edu.gh', '+233 24 497 7243', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-humprey-danso', 'usted-ksi', 'Prof. Humprey Danso', 'Prof.', 'Dean, School of Graduate Studies', 'Department of Construction and Wood Technology Education', 'School of Graduate Studies (SGS)', '25', '25-school-of-graduate-studies', 3, 'hdanso@aamusted.edu.gh', '+233 24 459 2831', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('dr-isaac-addai', 'usted-ksi', 'PROF. ISAAC ADDAI', 'Prof.', 'Vice Dean, SGS', 'Department of Interdisciplinary Studies', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-rm-32', 2, 'iaddai@aamusted.edu.gh', '+233 20 543 4821', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-joseph-antwi-baafi', 'usted-ksi', 'Prof. Joseph Antwi Baafi', 'Prof.', 'Assoc Prof', 'Department of Economics Education', 'Faculty of Business Education (FBE)', '25', '25-008', 0, 'Jbantwi@aamusted.edu.gh', '+233 24 499 4010', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('josephine-aboagyewaa-ntiri', 'usted-ksi', 'Prof. Josephine Aboagyewaa-Ntiri', 'Prof.', 'Assoc. Prof. , Dean', 'Department of Fashion Design and Textiles Education', 'Faculty of Vocational Education (FVE)', '35', '35-025', 0, 'jantiri@aamusted.edu.gh', '+233 55 040 1490', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('stella-appiah', 'usted-ksi', 'Prof. Stella Appiah', 'Prof.', 'Assoc Prof', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '21', '21-17', 1, 'stellaappiah@aamusted.edu.gh', '+233 20 896 9866', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-stephen-baffour-adjei', 'usted-ksi', 'Prof. Stephen Baffour Adjei', 'Prof.', 'Associate Professor', 'Department of Interdisciplinary Studies (DIS)', 'Faculty of Education and Communication Sciences (FECS)', '25', NULL, 0, 'sbadjei@aamusted.edu.gh', '+233 55 497 3575', 'building_only', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('prof-yarhands-dissou-arthur', 'usted-ksi', 'Prof. Yarhands Dissou Arthur', 'Prof.', 'DEAN, FASME', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, 'ydarthur@aamusted.edu.gh', '+233244071973', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('mrs-rabiatu-kamil', 'usted-ksi', 'Rabiatu Kamil (Ph.D. FCCA, ICAG)', '', 'Lecturer', 'Department of Accounting Education', 'Faculty of Business Education (FBE)', '25', '25-rm-42', 2, 'rkamil@aamusted.edu.gh', '+233 50 808 4880', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('rev-dr-benjamin-adu-obeng', 'usted-ksi', 'Rev. Dr. Benjamin Adu Obeng', 'Rev. Dr.', 'Lecturer', 'Department of Mathematics Education', 'Faculty of Applied Sciences and Mathematics Education (FASME)', NULL, NULL, 0, 'baduobeng@aamusted.edu.gh', '+233 54 344 8218', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('sawan-dankyi', 'usted-ksi', 'Sawan Dankyi', '', 'Lecturer', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '21', '21-esa', 1, 'sdankyi@aamusted.edu.gh', '+233 55 496 8626', 'building_only', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('sr-dr-mary-assumpta-ayikue', 'usted-ksi', 'Sr. Dr. Mary Assumpta Ayikue', 'Sr. Dr.', 'Lecturer', 'Department of Educational Leadership', 'Faculty of Education and Communication Sciences (FECS)', '25', '25-rm-27', 2, 'maayikue@aamusted.edu.gh', '+233 20 066 0287, +233 54 663 8361', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('veronica-adwoa-agyare', 'usted-ksi', 'Veronica Adwoa Agyare', 'Ms.', 'Assist. Lecturer', 'Department of Hospitality and Tourism Education', 'Faculty of Vocational Education (FVE)', '21', '21-15', 1, 'vaagyare@aamusted.edu.gh', '+233 54 813 4038', 'exact', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
INSERT INTO staff_directory (id, org_id, name, title, position, department, faculty, building_id, room_id, floor, email, phone, location_status, metadata)
VALUES ('victoria-timah', 'usted-ksi', 'Victoria Timah', '', 'Assistant Registrar', 'Quality Assurance Planning and Accreditation Directorate', '', NULL, NULL, 0, 'timahv37@gmail.com', '+233 24 406 8255, +233 20 033 4966', 'unresolved', '{"source":"people.json"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  faculty = EXCLUDED.faculty,
  building_id = EXCLUDED.building_id,
  room_id = EXCLUDED.room_id,
  floor = EXCLUDED.floor,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location_status = EXCLUDED.location_status,
  metadata = EXCLUDED.metadata;
