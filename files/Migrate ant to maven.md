# Migrate ant to maven

## Step by step process Migrating from ant to Maven

### Introduction

1. Identify Project Structure
	•	Ant projects often have loose folder structure.
	•	Maven requires a standard layout:

project/
 └─ src/
     ├─ main/
     │   ├─ java/
     │   └─ resources/
     └─ test/
         ├─ java/
         └─ resources/

2. Convert Ant Build Logic → Maven Plugins
	•	Replace Ant tasks (javac, jar, copy, etc.) with Maven lifecycle:
	•	compile → maven-compiler-plugin
	•	package → produces JAR/WAR automatically
	•	test → Surefire plugin
	•	dependencies → defined in pom.xml

3. Create pom.xml

4. Move Libraries to Maven Dependencies
	•	Replace lib/*.jar manually with dependencies in pom.xml.
	•	Remove bundled JARs from repo.

5. Delete Ant Build Files
	•	Remove build.xml or keep temporarily until Maven works.

